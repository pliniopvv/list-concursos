import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Concurso } from './entity/concurso';
import { createConnection } from 'typeorm';
import request from 'request';
import cheerio from 'cheerio';
import md5 from 'md5';

dotenv.config();

let URL = "https://www.pciconcursos.com.br/concursos/";
// let URL = "https://www.pciconcursos.com.br/ultimas/";


console.log("Baixando site ...");
request(URL, (err, res, body) => {

    // console.log(body);

    let lista: any = [];
    console.log("Processando site ...");

    let $ = cheerio.load(body);
    for (let index = 7; index < 1000; index++) {
        let title = $(`#concursos > div:nth-child(${index}) > div > a`).text().trim();
        let link = $(`#concursos > div:nth-child(${index}) > div > a`).attr('href');
        let data = $(`#concursos > div:nth-child(${index}) > div > div.ce > span`).text().trim();
        let descricao = $(`#concursos > div:nth-child(${index}) > div > div.cd`).text().trim();
        if (title.length == 0) {
            continue;
        }
        let ob = { title, link, data, descricao };
        let c = new Concurso();
        c.title = title;
        c.link = link;
        c.data = data;
        c.descricao = descricao;
        lista[lista.length] = ob;
    }
    // for (let i = 0; i < lista.length; i++) {
    //     let ob = lista[i];
    //     console.log("Titulo: ", ob.title, " Data: ", ob.data, " Descrição: ",
    //         ob.descricao, " Link: ", ob.link);
    // }
    // let cfg = {
    //     type: "sqlite",
    //     host: "localhost",
    //     port: 3306,
    //     username: "test",
    //     password: "test",
    //     database: "database.db",
    // };
    console.log("Criando database.db ...");
    // @ts-ignore
    createConnection().then(async connection => {

        for (let i = 0; i < lista.length; i++) {
            // let conc: Concurso = lista[i];
            let cS = lista[i];

            let c = new Concurso();
            c.title = cS.title;
            c.data = cS.data;
            c.descricao = cS.descricao;
            c.link = cS.link;
            c.md5 = md5("Titulo: " + c.title + " Data: " + c.data + " Descrição: " +
                c.descricao + " Link: " + c.link);
            try {
                let len = await connection.manager.save(c);
                console.log("[N] t: ", c.title, " d: ", c.descricao, " l: ", c.link);
            } catch (error) {
                // console.log("Error:", error);
                // console.log("MD5: ", c.md5);
                if (process.env.DEBUG) {
                    console.log(".");
                }
            }
        }

        // console.log("Saved a new user with id: " + user.id);

        // console.log("Loading users from the database...");
        // const users = await connection.manager.find(User);
        // console.log("Loaded users: ", users);

        // console.log("Here you can setup and run express/koa/any other framework.");

    }).catch(error => console.log(error));

    console.log("Finalizado ...");

    // $('div#concursos div.ca').each((i: Number, e: cheerio.Element) => {
    //     console.log("Title: ", $(this).find("a").text());
    //     // @ts-ignore
    //     console.log("Title: ", e.children[0].data);
    // });
});

