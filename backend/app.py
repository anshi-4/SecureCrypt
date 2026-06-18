import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import crypto_utils

app = Flask(__name__)
# Enable CORS for all API endpoints to allow frontend requests
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "SecureCrypt Backend"}), 200

@app.route('/api/rsa/generate', methods=['POST'])
def generate_rsa_keys():
    result = crypto_utils.rsa_generate_keypair()
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@app.route('/api/encrypt', methods=['POST'])
def encrypt():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON payload provided."}), 400
    
    algorithm = data.get("algorithm")
    plaintext = data.get("plaintext")
    
    if not algorithm:
        return jsonify({"success": False, "error": "Algorithm not specified."}), 400
    if plaintext is None:
        return jsonify({"success": False, "error": "Plaintext not provided."}), 400
        
    algorithm = algorithm.upper()
    
    if algorithm == "AES":
        key = data.get("key")
        if not key:
            return jsonify({"success": False, "error": "Encryption key is required for AES."}), 400
        result = crypto_utils.aes_encrypt(plaintext, key)
        
    elif algorithm == "DES":
        key = data.get("key")
        if not key:
            return jsonify({"success": False, "error": "Encryption key is required for DES."}), 400
        result = crypto_utils.des_encrypt(plaintext, key)
        
    elif algorithm == "RSA":
        public_key = data.get("publicKey")
        if not public_key:
            return jsonify({"success": False, "error": "Public key in PEM format is required for RSA encryption."}), 400
        result = crypto_utils.rsa_encrypt(plaintext, public_key)
        
    else:
        return jsonify({"success": False, "error": f"Unsupported algorithm: {algorithm}"}), 400
        
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@app.route('/api/decrypt', methods=['POST'])
def decrypt():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON payload provided."}), 400
        
    algorithm = data.get("algorithm")
    ciphertext = data.get("ciphertext")
    
    if not algorithm:
        return jsonify({"success": False, "error": "Algorithm not specified."}), 400
    if not ciphertext:
        return jsonify({"success": False, "error": "Ciphertext not provided."}), 400
        
    algorithm = algorithm.upper()
    
    if algorithm == "AES":
        key = data.get("key")
        iv = data.get("iv")
        if not key or not iv:
            return jsonify({"success": False, "error": "Both Key and IV are required for AES decryption."}), 400
        result = crypto_utils.aes_decrypt(ciphertext, key, iv)
        
    elif algorithm == "DES":
        key = data.get("key")
        iv = data.get("iv")
        if not key or not iv:
            return jsonify({"success": False, "error": "Both Key and IV are required for DES decryption."}), 400
        result = crypto_utils.des_decrypt(ciphertext, key, iv)
        
    elif algorithm == "RSA":
        private_key = data.get("privateKey")
        if not private_key:
            return jsonify({"success": False, "error": "Private key in PEM format is required for RSA decryption."}), 400
        result = crypto_utils.rsa_decrypt(ciphertext, private_key)
        
    else:
        return jsonify({"success": False, "error": f"Unsupported algorithm: {algorithm}"}), 400
        
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

if __name__ == '__main__':
    # Flask runs on port 5000 by default
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
