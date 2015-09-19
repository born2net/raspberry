import lirc
sockid = lirc.init("myprogram")
# lirc.load_config_file("/root/lircd.conf")
lirc.nextcode()  # press 1 on remote after this
lirc.deinit()
