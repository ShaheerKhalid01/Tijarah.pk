import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Chat from '@/models/Chat';
import Order from '@/models/Order';
import { getAllProducts } from '@/app/lib/product-data';

// ---------------------------------------------------------
// PRODUCT RECOMMENDATION LOGIC (ENHANCED)
// ---------------------------------------------------------
const getRecommendedProducts = (userQuery, limit = 3) => {
    const products = getAllProducts();
    const query = userQuery.toLowerCase();

    const scored = products.map(product => {
        let score = 0;
        const productName = product.name?.toLowerCase() || product.id?.toLowerCase() || '';
        const productBrand = product.brand?.toLowerCase() || '';
        const productCategory = product.category?.toLowerCase() || '';
        const productDesc = product.description?.toLowerCase() || '';

        // Exact matches and Title matches
        if (productName.includes(query)) score += 15;
        if (productBrand.includes(query)) score += 10;
        if (productCategory.includes(query)) score += 8;
        if (productDesc.includes(query)) score += 4;

        // Word matching
        const queryWords = query.split(/\s+/).filter(w => w.length > 2);
        queryWords.forEach(word => {
            if (productName.includes(word)) score += 4;
            if (productBrand.includes(word)) score += 3;
            if (productCategory.includes(word)) score += 2;
            if (productDesc.includes(word)) score += 1;
        });

        // Category triggers (General terms)
        const categoryTriggers = {
            'phone': 'smartphones',
            'mobile': 'smartphones',
            'computer': 'laptops',
            'pc': 'laptops',
            'audio': 'audio',
            'headphone': 'audio',
            'speaker': 'audio',
            'buds': 'audio',
            'watch': 'smartwatches',
            'fitness': 'smartwatches',
            'tablet': 'tablets'
        };

        // Brand triggers (Specific terms) 
        const brandTriggers = {
            'apple': 'apple',
            'iphone': 'apple',
            'ipad': 'apple',
            'macbook': 'apple',
            'samsung': 'samsung',
            'galaxy': 'samsung',
            'sony': 'sony',
            'audiotech': 'audiotech'
        };

        // Apply Category Boost
        Object.entries(categoryTriggers).forEach(([key, cat]) => {
            if (query.includes(key) && productCategory === cat) score += 5;
        });

        // Apply Brand Boost (Much stronger and specific)
        let brandMentioned = false;
        Object.entries(brandTriggers).forEach(([key, brand]) => {
            if (query.includes(key)) {
                brandMentioned = true;
                if (productBrand.includes(brand) || productName.includes(brand)) {
                    score += 15; // Heavy boost for matching brand
                } else {
                    score -= 5; // Penalty for other brands when a specific brand is mentioned
                }
            }
        });

        // Descriptive Qualifiers
        if (query.match(/\b(latest|newest|recent|new)\b/)) {
            if (product.isNew) score += 10;
        }
        if (query.match(/\b(cheap|budget|affordable|low price|economy)\b/)) {
            // Favor lower prices
            score += Math.max(0, 5 - (product.price / 1000));
        }
        if (query.match(/\b(premium|best|high end|pro|expensive)\b/)) {
            if (productName.includes('pro') || productName.includes('ultra') || productName.includes('max')) score += 5;
            score += Math.min(5, product.price / 1000);
        }
        if (query.match(/\b(deal|sale|discount|offer|hot)\b/)) {
            if (product.isHot || product.discount > 10) score += 8;
        }

        return { ...product, score };
    });

    return scored
        .filter(p => p.score > 2) // Higher threshold for quality
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...product }) => product);
};

// ---------------------------------------------------------
// ANTHROPIC API CALL (ENHANCED)
// ---------------------------------------------------------
async function callClaudeAPI(userMessage, history = [], foundProducts = []) {
    if (!process.env.ANTHROPIC_API_KEY) {
        return null;
    }

    // Build categories summary for AI context
    const categories = ['Smartphones', 'Laptops', 'Audio', 'Tablets', 'Smartwatches'];

    // Build found products summary
    const productContext = foundProducts.length > 0
        ? `I have found these products for the user (they are being displayed as cards): \n${foundProducts.map(p => `- ${p.name || p.id} (Price: $${p.price}, Brand: ${p.brand})`).join('\n')}`
        : "No specific products were found via search logic for this specific query, but I should still try to guide the user based on available categories.";

    const systemPrompt = `You are "Tijarah Assistant", the smart digital shopping expert for Tijarah.pk.

Your Goals:
1. Provide extremely helpful, friendly, and expert advice on electronics.
2. If products are found, reference them specifically in your response and explain why they are good choices.
3. If no products are found, suggest browsing categories like: ${categories.join(', ')}.
4. Keep responses concise (under 3 sentences) but informative.
5. Use professional terminology and mention prices in Dollars ($).

Context about current search:
${productContext}

Important: Do not invent products. Only talk about what I provide or general categories.`;

    // Format history for Claude
    const formattedMessages = history.slice(-6).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
    }));

    // Add current message
    formattedMessages.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 300,
                system: systemPrompt,
                messages: formattedMessages
            })
        });

        if (!response.ok) {
            console.error('Anthropic API Error:', await response.text());
            return null;
        }

        const data = await response.json();
        return data.content[0]?.text;
    } catch (error) {
        console.error('Claude API Call Failed:', error);
        return null;
    }
}

// ---------------------------------------------------------
// MAIN HANDLER
// ---------------------------------------------------------
export async function POST(req) {
    try {
        await dbConnect();
        const { message, sessionId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Missing message' }, { status: 400 });
        }

        // 1. Fetch History for Context
        let chatHistory = [];
        if (sessionId) {
            const existingChat = await Chat.findOne({ sessionId });
            if (existingChat) {
                chatHistory = existingChat.messages;
            }
        }

        // 2. Local Logic (Order Tracking)
        const lowerMsg = message.toLowerCase();
        const orderMatch = lowerMsg.match(/(ord-\w+|order\s*#?\s*\w+|#\w+)/i);

        let aiResponse = "";
        let recommendedProducts = [];

        if (orderMatch) {
            const orderNum = orderMatch[0].replace(/order\s*#?|#/i, '').trim().toUpperCase();
            const order = await Order.findOne({ orderNumber: { $regex: new RegExp(orderNum, 'i') } });

            if (order) {
                const statusEmoji = order.status === 'delivered' ? '✅' : order.status === 'shipped' ? '🚚' : '🕒';
                aiResponse = `I found your order! **Order #${order.orderNumber}** is currently **${order.status.toUpperCase()}** ${statusEmoji}. It contains ${order.items.length} items with a total of $${order.total}.`;
            } else {
                aiResponse = `I'm sorry, I couldn't find an order with number "${orderNum}". Please verify it in your profile or "My Orders" section.`;
            }
        }

        // 3. AI Intelligence ( Claude + Product Context )
        if (!aiResponse) {
            // First, find products locally to give AI context
            recommendedProducts = getRecommendedProducts(message);

            // Call AI with context
            aiResponse = await callClaudeAPI(message, chatHistory, recommendedProducts);

            // Fallback logic if AI fails
            if (!aiResponse) {
                if (lowerMsg.match(/\b(hi|hello|hey|salam)\b/)) {
                    aiResponse = "Walaikum Assalam! Welcome to Tijarah.pk. I'm your digital electronics expert. How can I help you find the perfect gadget today?";
                } else if (recommendedProducts.length > 0) {
                    aiResponse = `I've found some great options for you! Check out these ${recommendedProducts.length} items matching your request.`;
                } else {
                    aiResponse = "I can help you find products, check prices, or track orders. We have great deals on Smartphones, Laptops, and Audio gear in Dollars!";
                }
            }
        }

        // 4. Update Chat History
        if (sessionId) {
            let chat = await Chat.findOne({ sessionId });
            if (!chat) chat = new Chat({ sessionId, messages: [] });
            chat.messages.push({ role: 'user', content: message });
            chat.messages.push({ role: 'assistant', content: aiResponse });

            // Keep history manageable
            if (chat.messages.length > 40) chat.messages = chat.messages.slice(-40);

            await chat.save();
        }

        return NextResponse.json({
            response: aiResponse,
            products: recommendedProducts
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
