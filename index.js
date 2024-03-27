const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const keep_alive = require('./keep_alive.js');

const client = new Discord.Client();

const db = new sqlite3.Database('./users.db');

// Crea la tabella se non esiste già
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, points INTEGER DEFAULT 0)");
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageReactionAdd', (reaction, user) => {
    // Verifica se l'utente che ha reagito è quello specifico che stiamo controllando e se l'emozione è quella desiderata
    if (user.id === '1167379321023893554' && (reaction.emoji.id === '1172683738224787528' || reaction.emoji.id === '1197717403191234580')) {
        // Ottieni il messaggio a cui è stata aggiunta l'emozione
        const message = reaction.message;

        // Ottieni l'ID e il nickname dell'utente che ha inviato il messaggio
        const messageAuthorId = message.author.id;
        const messageAuthorUsername = message.author.username;

        // Aggiorna il numero di tasks per l'utente nel database
        db.run("INSERT OR IGNORE INTO users (id, username, points) VALUES (?, ?, 0)", [messageAuthorId, messageAuthorUsername], (err) => {
            if (err) {
                console.error('Errore durante l\'inserimento dell\'utente nel database:', err);
                return;
            }
            // Incrementa direttamente il conteggio dei tasks per l'utente
            db.run("UPDATE users SET points = points + 10 WHERE id = ?", [messageAuthorId], (err) => {
                if (err) {
                    console.error('Errore durante l\'aggiornamento dei points dell\'utente:', err);
                    return;
                }
                console.log('Utente aggiornato nel database:', messageAuthorUsername);
            });
        });

        // Invia un messaggio nel canale in cui è stato inviato il messaggio originale
        message.channel.send('10 points added');
    }
});


client.on('messageReactionAdd', (reaction, user) => {
    // Verifica se l'utente che ha reagito è quello specifico che stiamo controllando e se l'emozione è quella desiderata
    if (user.id === '1167379321023893554' && reaction.emoji.id === '1206743496589971556' ) {
        // Ottieni il messaggio a cui è stata aggiunta l'emozione
        const message = reaction.message;

        // Ottieni l'ID e il nickname dell'utente che ha inviato il messaggio
        const messageAuthorId = message.author.id;
        const messageAuthorUsername = message.author.username;

        // Aggiorna il numero di tasks per l'utente nel database
        db.run("INSERT OR IGNORE INTO users (id, username, points) VALUES (?, ?, 0)", [messageAuthorId, messageAuthorUsername], (err) => {
            if (err) {
                console.error('Errore durante l\'inserimento dell\'utente nel database:', err);
                return;
            }
            // Incrementa direttamente il conteggio dei tasks per l'utente
            db.run("UPDATE users SET points = points + 5 WHERE id = ?", [messageAuthorId], (err) => {
                if (err) {
                    console.error('Errore durante l\'aggiornamento dei points dell\'utente:', err);
                    return;
                }
                console.log('Utente aggiornato nel database:', messageAuthorUsername);
            });
        });

        // Invia un messaggio nel canale in cui è stato inviato il messaggio originale
        message.channel.send('5 points added');
    }
});


















client.on('message', message => {
    if (message.content === '!showdb') {
        db.all("SELECT username, points FROM users", (err, rows) => {
            if (err) {
                console.error('Errore durante la lettura del database:', err);
                return;
            }

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Tasks Made')
                .setDescription('Everyone task');

            rows.forEach(row => {
                embed.addField('Nickname', row.username, true);
                embed.addField('Tasks', row.points, true);
            });

            message.channel.send(embed);
        });
    }
});



client.login(process.env.TOKEN);
