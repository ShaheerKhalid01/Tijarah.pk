import fetch from 'node-fetch';

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/products/category/electronics');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Test failed:', e);
    }
}

test();
