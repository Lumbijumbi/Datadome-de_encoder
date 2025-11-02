# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-02

### Added
- Initial release of datadome-de-encoder
- DataDomeEncryptor class for encrypting data
- DataDomeDecryptor class for decrypting data
- Support for both 'captcha' and 'interstitial' challenge types
- Configurable salt for encryption/decryption
- Custom PRNG implementation for secure obfuscation
- Custom base64-like encoding
- UTF-8 encoding support
- Comprehensive README documentation in French
- MIT License
- Express.js server example with REST API endpoints
- Examples README documentation
- Development dependencies for Express server example

### Features
- Encrypt key-value pairs for DataDome challenges
- Decrypt DataDome payloads
- Dynamic HSV generation for captcha mode
- Fixed HSV for interstitial mode
- Challenge type switching capability
- Salt auto-generation or manual specification
- Full encryption/decryption cycle support
- REST API interface via Express.js example

[1.0.0]: https://github.com/Lumbijumbi/Datadome-de_encoder/releases/tag/v1.0.0
