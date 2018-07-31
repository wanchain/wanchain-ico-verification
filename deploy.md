# Deploy Steps

1. Create the app bundle
```
meteor build ../ico-tool-build --architecture os.linux.x86_64
```

2. Move bundle to server
```
cd ../ico-tool-build
scp wanchain-ico-verification.tar.gz <user>@<ip>:~/
```

3. Log on to server and untar the bundle
```
ssh <user>@<ip>
sudo mv /opt/ico-verification-tool/bundle{,-previous}
sudo tar -xzvf wanchain-ico-verification.tar.gz -C /opt/ico-verification-tool
sudo chown -R explorer:explorer /opt/ico-verification-tool
```

4. Install node packages
```
sudo su explorer
cd /opt/ico-verification-tool/bundle/programs/server
npm install
```

5. Update settings in ecosystem.json (if settings were changed)
```
cd /opt/ico-verification-tool
vi ecosystem.json
# look for METEOR_SETTINGS
```

6. Start the app
```
pm2 delete all
pm2 start ecosystem.json
```

7. Confirm that the app is running
```
pm2 logs
```
