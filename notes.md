# Wanchain ICO Verifier




<code>ssh root@159.89.159.139</code>

### Gwan Servers
####Testnet
<pre>./gwan --rpc --rpccorsdomain "*" --testnet --rpcapi eth,net,admin,personal,wan,filter --rpcaddr 159.89.159.139 --rpcport 8549 --verbosity=0 console</pre>

####Mainnet
<pre>./gwan --rpc --rpccorsdomain "*"  --rpcapi eth,net,admin,personal,wan,filter --rpcaddr 159.89.159.139 --rpcport 8546 --port "18544" --verbosity=0 console</pre>
### Wanchain Server (EC2)

<code>ssh -i ~/.ssh/wanchain_id_rsa harry@18.218.197.29</code>

### Build
`meteor build /meteorBuilds/icoTool/:path --architecture os.linux.x86_64`



cp -R ~/meteorBuilds/icoTool/buildThree/bundle/programs/server/.uploads ~/backupFiles/

rm -rf ~/meteorBuilds/icoTool/buildThree/contract-verification-tool.tar.gz

rm -rf ~/meteorBuilds/icoTool/buildThree/bundle

meteor build ~/meteorBuilds/icoTool/buildThree --architecture os.linux.x86_64

tar -xvzf ~/meteorBuilds/icoTool/buildThree/ico-contract-verification-tool.tar.gz

cd ~/meteorBuilds/icoTool/buildThree/bundle/programs/server

npm install

mkdir .uploads

cp -R ~/backupFiles/.uploads ~/meteorBuilds/icoTool/buildThree/bundle/programs/server/.uploads 

sudo service icotool restart

sudo service nginx restart

`tar -xvzf contract-verification-tool.tar.gz`

