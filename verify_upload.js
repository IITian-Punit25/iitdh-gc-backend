import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Create a dummy text file to test rejection
const textFile = 'test.txt';
fs.writeFileSync(textFile, 'This is a text file, not an image.');

// Create a dummy image file (empty content, but valid extension)
const imageFile = 'test.jpg';
fs.writeFileSync(imageFile, 'fake image content');

// Function to upload file
async function uploadFile(filename, password) {
    const form = new FormData();
    form.append('image', fs.createReadStream(filename));

    try {
        const res = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: form,
            headers: {
                'x-admin-password': password,
                ...form.getHeaders() // Important for multipart/form-data
            }
        });
        const data = await res.json();
        return { status: res.status, data };
    } catch (error) {
        return { error: error.message };
    }
}

async function runTests() {
    // 1. Test Text File Upload (Should Fail)
    console.log('Test 1: Uploading text file...');
    const res1 = await uploadFile(textFile, process.env.ADMIN_PASSWORD || 'your_admin_password_here');
    console.log('Result:', res1);

    // 2. Test Image File Upload (Should Pass - if content check isn't deep, otherwise might fail but validation logic is extension based so far)
    console.log('\nTest 2: Uploading image file...');
    // Note: Since we are using "fake image content", if multer does deep inspection it would fail, but our filter is regex on name only.
    const res2 = await uploadFile(imageFile, process.env.ADMIN_PASSWORD || 'your_admin_password_here');
    console.log('Result:', res2);

    // Cleanup
    fs.unlinkSync(textFile);
    fs.unlinkSync(imageFile);
}

runTests();
