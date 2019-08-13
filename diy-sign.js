const fs = require('fs');
const crypto = require('crypto');

/**
 * A helper function to compute sha256
 * @private
 * @param {Buffer} data Data to be hashed
 * @returns {Buffer} Digest in the binary form
 */
function _sha256(data) {
	return crypto.createHash('sha256').update(data).digest();
}

/**
 * Computes the signature of the data:
 *   sha256( sha256(secretKey) || message )
 * || denotes concatenation of two Buffers
 * @private
 * @param {Buffer} secretKey A key to be mixed with the data to create the signature
 * @param {Buffer} message Data to be signed
 * @returns {Buffer} Signature in the binary form
 */
function _createSignature(secretKey, message) {
	const secretSha256 = _sha256(secretKey);
	const saltedMessage = Buffer.concat([secretSha256, message]);
	const signature = _sha256(saltedMessage);
	return signature;
}

const command = process.argv[2]
const secretKey = process.argv[3];
const filename = process.argv[4];
const signatureFilename = filename + '.signature';

if (command === 'sign' && filename && secretKey) {

	const data = fs.readFileSync(filename);
	const signature = _createSignature(secretKey, data);
	const signatureHex = signature.toString('hex');
	fs.writeFileSync(signatureFilename, signatureHex);
	console.log(`Created "${ signatureFilename }"`);

} else if (command === 'check' && filename && secretKey) {

	const data = fs.readFileSync(filename);
	const signatureHex = fs.readFileSync(signatureFilename, 'utf-8');
	const signature = Buffer.from(signatureHex, 'hex');
	const signatureShouldBe = _createSignature(secretKey, data);
	if (Buffer.compare(signature, signatureShouldBe) === 0) {
		console.log(`OK`);
	} else {
		console.log(`Signature ${ signature.toString('hex') } is NOT OK!\nExpected: ${ signatureShouldBe.toString('hex') }`);
		process.exitCode = 1;
	}

} else {

	console.error(`Usage:`);
	console.error(`\tnode diy-sign sign SECRET_KEY FILE`);
	console.error(`\tnode diy-sign check SECRET_KEY FILE`);
	process.exitCode = 1;

}
