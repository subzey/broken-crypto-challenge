# Broken Crypto Challenge

## TL;DR

Your goal is to forge a message using flaws in this DIY crypto.

## Description

This repo contains a node.js script for DIY cryptographic signing of arbitrary files, `diy-sign.js`.

### How a Signature is Constructed

A signature is `sha256( sha256(secretKey) || fileContents )`.

_`||` denotes the concatenation of binary buffers: `[1, 2, 3] || [4, 5] -> [1, 2, 3, 4, 5]`._

The `fileContents` is public, but the `secretKey` is... well, secret. So creating or guessing the correct signature for the file+secret without knowing the secret is virtually impossible.

*Or is it possible?*

### Creating a Signature

```sh
node diy-sign sign "SECRET KEY" "myfile.bin"
```

Calculates the signature out of `myfile.bin` and `SECRET KEY` and stores it into the file named `myfile.bin.signature` as a hexadecimal ASCII string.

### Checking a Signature

```sh
node diy-sign check "SECRET KEY" "myfile.bin"
```

Calculates the signature out of `myfile.bin` and `SECRET KEY` and checks if the signature stored in `myfile.bin.signature` is the same.

## Public Data

- The implementation of `diy-sign.js` is public.

- A file `message.zip` that contains `readme.txt` with some nice greetings.

- A file `message.zip.signature` that was created with

```sh
node diy-sign sign $my_secret "message.zip"
```

_Obviously, I won't tell you what was the value of the `$my_secret` variable. I will check the `pwnd.zip.signature` using this exact key._

## Goal

The goal is to create two files with a forged signature:

- `pwnd.zip` that contains `readme.txt` with **some other text**.

- `pwnd.zip.signature` that matches the signature based on my `$my_secret` (that you don't know). Tricking me into thinking the `pwnd.zip` is a legitimate message from someone who knows `$my_secret`.

In other words, when I call `node diy-crypto $my_secret pwnd.zip` it should print "OK".

## How to Participate

Send me a Pull Request with these files and (optionally) the description of the technique, scripts, or anything that helps others learn that rolling out your own crypto can be dangerous.
