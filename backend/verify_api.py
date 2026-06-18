import crypto_utils

def test_aes():
    print("[*] Testing AES-256-CBC...")
    plaintext = "SecureCrypt: Advanced Cryptographic Engine"
    key = "cyber-sentinel-key"
    
    # Encrypt
    enc_res = crypto_utils.aes_encrypt(plaintext, key)
    if not enc_res.get("success"):
        print(f"[!] AES Encryption Failed: {enc_res.get('error')}")
        return False
        
    print(f"    IV: {enc_res['iv']}")
    print(f"    Ciphertext: {enc_res['ciphertext']}")
    
    # Decrypt
    dec_res = crypto_utils.aes_decrypt(enc_res["ciphertext"], key, enc_res["iv"])
    if not dec_res.get("success"):
        print(f"[!] AES Decryption Failed: {dec_res.get('error')}")
        return False
        
    print(f"    Decrypted Plaintext: {dec_res['plaintext']}")
    assert dec_res["plaintext"] == plaintext, "AES Decrypted text mismatch!"
    print("[+] AES-256-CBC verified successfully!\n")
    return True

def test_des():
    print("[*] Testing DES-CBC...")
    plaintext = "DES Payload Standard"
    key = "des-key-1"
    
    # Encrypt
    enc_res = crypto_utils.des_encrypt(plaintext, key)
    if not enc_res.get("success"):
        print(f"[!] DES Encryption Failed: {enc_res.get('error')}")
        return False
        
    print(f"    IV: {enc_res['iv']}")
    print(f"    Ciphertext: {enc_res['ciphertext']}")
    
    # Decrypt
    dec_res = crypto_utils.des_decrypt(enc_res["ciphertext"], key, enc_res["iv"])
    if not dec_res.get("success"):
        print(f"[!] DES Decryption Failed: {dec_res.get('error')}")
        return False
        
    print(f"    Decrypted Plaintext: {dec_res['plaintext']}")
    assert dec_res["plaintext"] == plaintext, "DES Decrypted text mismatch!"
    print("[+] DES-CBC verified successfully!\n")
    return True

def test_rsa():
    print("[*] Testing RSA-OAEP...")
    # Generate keys
    keys = crypto_utils.rsa_generate_keypair()
    if not keys.get("success"):
        print(f"[!] RSA Key Generation Failed: {keys.get('error')}")
        return False
        
    print("    RSA Keys generated successfully.")
    
    plaintext = "RSA OAEP Secret Message"
    
    # Encrypt
    enc_res = crypto_utils.rsa_encrypt(plaintext, keys["public_key"])
    if not enc_res.get("success"):
        print(f"[!] RSA Encryption Failed: {enc_res.get('error')}")
        return False
        
    print(f"    Ciphertext: {enc_res['ciphertext']}")
    
    # Decrypt
    dec_res = crypto_utils.rsa_decrypt(enc_res["ciphertext"], keys["private_key"])
    if not dec_res.get("success"):
        print(f"[!] RSA Decryption Failed: {dec_res.get('error')}")
        return False
        
    print(f"    Decrypted Plaintext: {dec_res['plaintext']}")
    assert dec_res["plaintext"] == plaintext, "RSA Decrypted text mismatch!"
    print("[+] RSA-OAEP verified successfully!\n")
    return True

if __name__ == "__main__":
    print("==========================================")
    print("  Running SecureCrypt Cryptography Tests  ")
    print("==========================================\n")
    
    aes_ok = test_aes()
    des_ok = test_des()
    rsa_ok = test_rsa()
    
    if aes_ok and des_ok and rsa_ok:
        print("[SUCCESS] All cryptography utilities verified successfully!")
    else:
        print("[FAILURE] One or more cryptography checks failed.")
