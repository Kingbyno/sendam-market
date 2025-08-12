#!/bin/bash
# Pre-deployment script to ensure Prisma client is generated

echo "Generating Prisma client..."
prisma generate

echo "Prisma client generated successfully!"
