#!/bin/bash

IN_DIR="./src/proto"
OUT_DIR="./src/proto/generated"

# Generate the the JS and TS files
protoc --ts_out=${OUT_DIR} --ts_opt=target=node --js_out=import_style=commonjs,binary:${OUT_DIR} -I ${IN_DIR} ${IN_DIR}/*.proto

# Troubleshooting

# If you get an error like this: "protoc-gen-ts: program not found or is not executable"
# then you might need to install the protoc-gen-ts plugin as a global packge: npm install -g protoc-gen-ts