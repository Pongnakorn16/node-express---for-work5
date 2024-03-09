import express from "express";
import { conn, queryAsync } from "../db.connect";
import { json } from "body-parser";
import { Movie, Person, toCreators, toStars } from "./model/Model_for_api";
import { UserPutRequest } from "./model/Model_for_api";

export const router = express.Router(); // Router คือตัวจัดการเส้นทาง


router.get("/", (req, res)=>{

        const sql = "select * from Movie4";
        conn.query(sql, (err, result)=>{
            if(err){
                res.status(400).json(err);
            }else{
                
                res.json(result);
            }
        });
});

router.get("/getAllperson", (req, res)=>{

    const sql = "select * from Person4";
    conn.query(sql, (err, result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            
            res.json(result);
        }
    });
});


router.get("/getMovie:mid", (req, res)=>{

    const mid = req.params.mid;
    const sql = "SELECT * from Movie4 where mid = ?"
    conn.query(sql, [mid], (err, result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            
            res.json(result);
        }
    });
});


router.get("/AddtoStar:A_mid/:pid", (req, res)=>{
    const mid = req.params.A_mid;
    const pid = req.params.pid;
    const sql = "INSERT INTO `Stars4`(`mids`, `pids`) VALUES (?,?)"
    conn.query(sql, [mid,pid], (err, result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            
            res.json(result);
        }
    });
});


router.get("/AddtoCreator:A_mid/:pid", (req, res)=>{
    const mid = req.params.A_mid;
    const pid = req.params.pid;
    const sql = "INSERT INTO `Creators4`(`midc`, `pidc`) VALUES (?,?)"
    conn.query(sql, [mid,pid], (err, result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            
            res.json(result);
        }
    });
});



router.get("/getStarsAndCreators/:movieName", (req, res) => {
    const movieName = req.params.movieName;
    const likePattern = '%' + movieName + '%'; // เพิ่ม wildcard % ทั้งหมดด้านหน้าและด้านหลังของชื่อหนัง

    const sqlStars = "SELECT * FROM Person4 INNER JOIN Stars4 ON Person4.pid = Stars4.pids INNER JOIN Movie4 ON Stars4.mids = Movie4.mid WHERE Movie4.name LIKE ?";
    const sqlCreators = "SELECT midc,pidc,pid, p_name, age, detail, p_image FROM Person4 INNER JOIN Creators4 ON Person4.pid = Creators4.pidc INNER JOIN Movie4 ON Creators4.midc = Movie4.mid WHERE Movie4.name LIKE ?";

    conn.query(sqlStars, [likePattern], (errStars, resultStars) => {
        if (errStars) {
            return res.status(400).json(errStars);
        } else {
            conn.query(sqlCreators, [likePattern], (errCreators, resultCreators) => {
                if (errCreators) {
                    return res.status(400).json(errCreators);
                } else {
                    const combinedResult = [...resultStars, ...resultCreators];
                    res.json(combinedResult);
                }
            });
        }
    });
});






import mysql from "mysql";

    router.post("/upload-movie",(req,res)=>{
        const new_movie : Movie = req.body;
    
                    let sql = "INSERT INTO `Movie4`(`name`, `score`, `genre`,`poster`,`des`) VALUES (?,?,?,?,?)";
                    sql = mysql.format(sql, [
                        new_movie.name,
                        new_movie.score,
                        new_movie.genre,
                        new_movie.poster,
                        new_movie.des
                    ]);
                    conn.query(sql,(err,result)=>{
                        if(err) throw err;
                        res.status(201).json({
                            affected_row: result.affected_rowRows
                        });
                    });
    });


    router.post("/upload-person",(req,res)=>{
        const new_person : Person = req.body;
    
                    let sql = "INSERT INTO `Person4`(`p_name`, `age`, `detail`,`p_image`) VALUES (?,?,?,?)";
                    sql = mysql.format(sql, [
                        new_person.name,
                        new_person.age,
                        new_person.detail,
                        new_person.p_image
                    ]);
                    conn.query(sql,(err,result)=>{
                        if(err) throw err;
                        res.status(201).json({
                            affected_row: result.affected_rowRows
                        });
                    });
    });


    router.post("/AddtoStar", (req, res)=>{
        const new_star : toStars = req.body;
        let sql = "INSERT INTO `Stars4`(`mids`, `pids`) VALUES (?,?)"
                sql = mysql.format(sql, [
                    new_star.mids,
                    new_star.pids
                ]);
        conn.query(sql, (err, result)=>{
            if(err){
                res.status(400).json(err);
            }else{
                
                res.json(result);
            }
        });
    });

    router.post("/AddtoCreator", (req, res)=>{
        const new_star : toCreators = req.body;
        let sql = "INSERT INTO `Creators4`(`midc`, `pidc`) VALUES (?,?)"
                sql = mysql.format(sql, [
                    new_star.midc,
                    new_star.pidc
                ]);
        conn.query(sql, (err, result)=>{
            if(err){
                res.status(400).json(err);
            }else{
                
                res.json(result);
            }
        });
    });
    

    router.delete("/deleteStar:A_mid/:pid",(req,res)=>{
        const A_mid = req.params.A_mid;
        const pid = req.params.pid;
        let sql = "DELETE FROM Stars4 WHERE mids = ? and pids = ?";
        conn.query(sql,[A_mid,pid],(err,result)=>{
                if (err) throw err;
                res.status(200).json({
                    affected_row : result.affectedRows
                });
            });
        });


    router.delete("/deleteCreator:A_mid/:pid",(req,res)=>{
        const A_mid = req.params.A_mid;
        const pid = req.params.pid;
        let sql = "DELETE FROM Creators4 WHERE midc = ? and pidc = ?";
        conn.query(sql,[A_mid,pid],(err,result)=>{
                if (err) throw err;
                res.status(200).json({
                    affected_row : result.affectedRows
                });
            });
        });

        
        router.delete("/deleteMovie:mid",(req,res)=>{
            const mid = req.params.mid;
            let sql = "DELETE FROM Creators4 WHERE midc = ?";
            conn.query(sql,[mid],(err,result)=>{
                if(err) {
                    let sqlDeletePhoto = "DELETE FROM Stars4 WHERE mids = ?";
                conn.query(sqlDeletePhoto, [mid], (err, result) => {
                    if (err) throw err;
                    res.status(200).json({
                        affected_row : result.affectedRows
                    });
                });
                }
                let sqlDeletePhoto = "DELETE FROM Stars4 WHERE mids = ?";
                conn.query(sqlDeletePhoto, [mid], (err, result) => {
                    if (err) {
                 
                    }
                let sqlDeletePhoto2 = "DELETE FROM Movie4 WHERE mid = ?";
                conn.query(sqlDeletePhoto2, [mid], (err, result) => {
                    if (err) throw err;
                    res.status(200).json({
                        affected_row : result.affectedRows
                    });
                });
            });
        });
    });


    router.delete("/deletePerson:pid",(req,res)=>{
        const pid = req.params.pid;
        let sql = "DELETE FROM Creators4 WHERE pidc = ?";
        conn.query(sql,[pid],(err,result)=>{
            if(err) {
                let sqlDeletePhoto = "DELETE FROM Stars4 WHERE pids = ?";
            conn.query(sqlDeletePhoto, [pid], (err, result) => {
                if (err) throw err;
                res.status(200).json({
                    affected_row : result.affectedRows
                });
            });
            }
            let sqlDeletePhoto = "DELETE FROM Stars4 WHERE pids = ?";
            conn.query(sqlDeletePhoto, [pid], (err, result) => {
                if (err) {
             
                }
            let sqlDeletePhoto2 = "DELETE FROM Person4 WHERE pid = ?";
            conn.query(sqlDeletePhoto2, [pid], (err, result) => {
                if (err) throw err;
                res.status(200).json({
                    affected_row : result.affectedRows
                });
            });
        });
    });
});