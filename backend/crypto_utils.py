import base64
import hashlib
from Crypto.Cipher import AES, DES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad, unpad
from Crypto.Hash import SHA256

def derive_key(key_str: str, num_bytes: int) -> bytes:
    """
    Derive a key of exact byte length from a user-supplied string using SHA-256.
    """
    hasher = hashlib.sha256(key_str.encode('utf-8'))
    return hasher.digest()[:num_bytes]

# ==========================================
# AES-256-CBC Encryption & Decryption
# ==========================================
def aes_encrypt(plaintext: str, key_str: str) -> dict:
    try:
        # Derive 32-byte key for AES-256
        key = derive_key(key_str, 32)
        # Create cipher with random 16-byte IV
        cipher = AES.new(key, AES.MODE_CBC)
        iv = cipher.iv
        
        # Pad and encrypt
        padded_data = pad(plaintext.encode('utf-8'), AES.block_size)
        ciphertext = cipher.encrypt(padded_data)
        
        return {
            "success": True,
            "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
            "iv": base64.b64encode(iv).decode('utf-8')
        }
    except Exception as e:
        return {"success": False, "error": f"AES encryption failed: {str(e)}"}

def aes_decrypt(ciphertext_b64: str, key_str: str, iv_b64: str) -> dict:
    try:
        key = derive_key(key_str, 32)
        iv = base64.b64decode(iv_b64)
        ciphertext = base64.b64decode(ciphertext_b64)
        
        cipher = AES.new(key, AES.MODE_CBC, iv=iv)
        decrypted_padded = cipher.decrypt(ciphertext)
        
        # Unpad
        plaintext = unpad(decrypted_padded, AES.block_size).decode('utf-8')
        return {"success": True, "plaintext": plaintext}
    except ValueError as ve:
        return {"success": False, "error": f"AES decryption failed: Invalid key, IV, or corrupted data (Padding error)."}
    except Exception as e:
        return {"success": False, "error": f"AES decryption failed: {str(e)}"}

# ==========================================
# DES-CBC Encryption & Decryption
# ==========================================
def des_encrypt(plaintext: str, key_str: str) -> dict:
    try:
        # Derive 8-byte key for DES
        key = derive_key(key_str, 8)
        # Create cipher with random 8-byte IV
        cipher = DES.new(key, DES.MODE_CBC)
        iv = cipher.iv
        
        # Pad and encrypt
        padded_data = pad(plaintext.encode('utf-8'), DES.block_size)
        ciphertext = cipher.encrypt(padded_data)
        
        return {
            "success": True,
            "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
            "iv": base64.b64encode(iv).decode('utf-8')
        }
    except Exception as e:
        return {"success": False, "error": f"DES encryption failed: {str(e)}"}

def des_decrypt(ciphertext_b64: str, key_str: str, iv_b64: str) -> dict:
    try:
        key = derive_key(key_str, 8)
        iv = base64.b64decode(iv_b64)
        ciphertext = base64.b64decode(ciphertext_b64)
        
        cipher = DES.new(key, DES.MODE_CBC, iv=iv)
        decrypted_padded = cipher.decrypt(ciphertext)
        
        # Unpad
        plaintext = unpad(decrypted_padded, DES.block_size).decode('utf-8')
        return {"success": True, "plaintext": plaintext}
    except ValueError as ve:
        return {"success": False, "error": f"DES decryption failed: Invalid key, IV, or corrupted data (Padding error)."}
    except Exception as e:
        return {"success": False, "error": f"DES decryption failed: {str(e)}"}

# ==========================================
# RSA Key Generation & Encryption/Decryption
# ==========================================
def rsa_generate_keypair() -> dict:
    try:
        key = RSA.generate(2048)
        private_key = key.export_key().decode('utf-8')
        public_key = key.publickey().export_key().decode('utf-8')
        return {
            "success": True,
            "private_key": private_key,
            "public_key": public_key
        }
    except Exception as e:
        return {"success": False, "error": f"RSA key pair generation failed: {str(e)}"}

def rsa_encrypt(plaintext: str, public_key_pem: str) -> dict:
    try:
        # Load public key
        pub_key = RSA.import_key(public_key_pem)
        # PKCS1_OAEP with SHA-256
        cipher = PKCS1_OAEP.new(pub_key, hashAlgo=SHA256)
        
        # RSA can only encrypt small payloads up to key size limit
        # For 2048-bit keys and OAEP SHA-256, the maximum message size is 2048/8 - 2*32 - 2 = 190 bytes.
        plaintext_bytes = plaintext.encode('utf-8')
        if len(plaintext_bytes) > 190:
            return {
                "success": False,
                "error": "RSA encryption failed: Plaintext too long for 2048-bit key using OAEP-SHA256 (max 190 bytes). For larger payloads, hybrid encryption (AES+RSA) is recommended."
            }
            
        ciphertext = cipher.encrypt(plaintext_bytes)
        return {
            "success": True,
            "ciphertext": base64.b64encode(ciphertext).decode('utf-8')
        }
    except Exception as e:
        return {"success": False, "error": f"RSA encryption failed: {str(e)}"}

def rsa_decrypt(ciphertext_b64: str, private_key_pem: str) -> dict:
    try:
        # Load private key
        priv_key = RSA.import_key(private_key_pem)
        cipher = PKCS1_OAEP.new(priv_key, hashAlgo=SHA256)
        
        ciphertext = base64.b64decode(ciphertext_b64)
        decrypted = cipher.decrypt(ciphertext)
        
        return {
            "success": True,
            "plaintext": decrypted.decode('utf-8')
        }
    except ValueError as ve:
        return {"success": False, "error": "RSA decryption failed: Ciphertext integrity check failed. Verify that you used the correct private key corresponding to the public key."}
    except Exception as e:
        return {"success": False, "error": f"RSA decryption failed: {str(e)}"}
