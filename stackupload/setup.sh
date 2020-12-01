#!/bin/bash
if [ ! -f ./mc ]
then
  echo "Downloading Minio Client from dl.min.io"
  wget https://dl.min.io/client/mc/release/linux-amd64/mc
  chmod +x mc
fi

./mc alias set stackmarket http://localhost:9000 AKIAIOSFODNN7EXAMPLE wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
./mc mb stackmarket/stackmarket
./mc policy set public stackmarket/stackmarket
