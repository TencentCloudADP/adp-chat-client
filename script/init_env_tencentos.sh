sudo yum update -y
sudo yum install -y yum-utils
sudo yum config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io # 如在这一步报错，请去/etc/yum.repos.d/docker-ce.repo修改适合server的版本号后再次进行操作

cat << EOF > /etc/docker/daemon.json
{
   "registry-mirrors": [
       "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

systemctl daemon-reload
service docker restart
