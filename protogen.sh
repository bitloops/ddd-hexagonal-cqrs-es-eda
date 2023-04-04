#!/bin/bash

IN_DIR="./src/proto"
OUT_DIR="./src/proto/generated"

# Generate the types
yarn proto-loader-gen-types \
    --grpcLib=@grpc/grpc-js \
    --outDir=${OUT_DIR}/ \
    ${IN_DIR}/*.proto