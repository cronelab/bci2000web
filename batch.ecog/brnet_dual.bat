netsh interface ip set address name="Ethernet" dhcp
netsh interface ip set dns name="Ethernet" dhcp 

netsh interface ip set address name="Startech_A" static 192.168.137.6 255.255.255.0 none
netsh interface ip set dns name="Startech_A" static none 
netsh interface ip add dns name="Startech_A" none index=2

netsh interface ip set address name="Startech_B" static 192.168.137.18 255.255.255.0 none
netsh interface ip set dns name="Startech_B" static none
netsh interface ip add dns name="Startech_B" none index=2

netsh interface ip set address name="Startech2_A" static 192.168.137.6 255.255.255.0 none
netsh interface ip set dns name="Startech2_A" static none 
netsh interface ip add dns name="Startech2_A" none index=2

netsh interface ip set address name="Startech2_B" static 192.168.137.18 255.255.255.0 none
netsh interface ip set dns name="Startech2_B" static none
netsh interface ip add dns name="Startech2_B" none index=2

ping 192.168.137.128
