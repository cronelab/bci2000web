netsh interface ip set address name="Ethernet" static 192.168.137.6 255.255.255.0 none
netsh interface ip set dns name="Ethernet" static none 
netsh interface ip add dns name="Ethernet" none index=2

ping 192.168.137.128
