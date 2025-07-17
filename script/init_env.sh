sudo apt update
sudo apt install docker.io -y

cat << EOF > /etc/docker/daemon.json
{
   "registry-mirrors": [
       "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

systemctl daemon-reload
service docker restart
