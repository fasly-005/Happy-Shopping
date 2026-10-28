const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('209124503371-r2t0tmre4dut128bhru63nhgjh6s071n.apps.googleusercontent.com');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { credential } = JSON.parse(event.body);
        
        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: '209124503371-r2t0tmre4dut128bhru63nhgjh6s071n.apps.googleusercontent.com',
        });
        
        const payload = ticket.getPayload();
        
        // Return user payload to frontend
        return {
            statusCode: 200,
            body: JSON.stringify({
                name: payload.name,
                email: payload.email,
                picture: payload.picture
            })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid Google Token' })
        };
    }
};