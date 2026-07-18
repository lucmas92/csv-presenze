PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users
        (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT,
            username      TEXT,
            password_hash VARCHAR(255)NOT NULL,
            role          VARCHAR(50) NOT NULL,
            is_active     TINYINT(1)  NOT NULL DEFAULT 1,
            last_login_at DATETIME    NULL
        );
INSERT INTO users VALUES(1,'Alberto Veronese','albver','$2b$10$Qq6rHMw3MAQBRNqFtCoIcee4il9BSwkYAvEPV6xwYaIvTmNPXZIRG','admin',0,'2026-07-17 19:24:10');
INSERT INTO users VALUES(2,'Jacopo Fincato','','','user',0,NULL);
INSERT INTO users VALUES(3,'Andrea Natalino','andnat','$2b$10$RWyEFMdz9KrWRBdV7e13..iKl9g3JC8/nqz4y4YlShnP0D8ViIiPG','user',0,NULL);
INSERT INTO users VALUES(4,'Erika Secondin','erisec','$2b$10$bZeT6G3N5aqEHBV6r45JuujboD1E6.xwGBfnG4uRQZVm3aCWgMVnC','user',0,NULL);
INSERT INTO users VALUES(5,'Luca Marcon','lucmac','$2b$10$AvVElKjor2W7qfq4oCMTgetkL5ABOFRcFxZ4IYn43VFz3vOyPrbdK','user',0,NULL);
INSERT INTO users VALUES(6,'Dennis Greggio','dengre','$2b$10$ysUoxKSN6Axa2UJnPL5TCeLzarM2pTV/n0q6ePx7og2ej2kYzAjay','user',0,NULL);
INSERT INTO users VALUES(7,'Silvia Cellini','silcel','$2b$10$1n01gPm0ZSViGtHDo0c.PeFBucJ.E2lDZOoTV0l2r4KN051Mle/aG','user',0,NULL);
INSERT INTO users VALUES(8,'Michela Pozza','micpoz','$2b$10$a0LVqSsnXKSQbE8j/PqDkOmn8Hz8Y48qqj7W8zBDOQ2JEyQUI2xbG','user',0,NULL);
INSERT INTO users VALUES(9,'Roberto Simon','robsim','$2b$10$ZTC.SaMZYCYwGj6Jnsgr9uANIUtc.U9QLIjfLg.obykCk9c7iN1Ha','user',0,NULL);
INSERT INTO users VALUES(10,'Daniele Fioretto','danfio','$2b$10$QYjzw7Qg5f3ZaOl.2hktM.d3t4FIgBJdq93FuhPit/tbmYg9RYXem','user',0,NULL);
INSERT INTO users VALUES(11,'Martina Campese','marcae','$2b$10$8jve2dqBcSL2qYplJo2vce0oxB2MnUlIUtlUX/RrwujFtiaw.lBrK','user',0,NULL);
INSERT INTO users VALUES(12,'Diego Bravin','diebra','$2b$10$HGkUl.AzmGE67Plz2LSltu.pzOmvF/Za1JCAJpPQh6KqoXqHDQrtC','user',0,NULL);
INSERT INTO users VALUES(13,'Abramo Franchetti','abrfra','$2b$10$s/1/UG.zYczME9IQLiz.9eMJQY2gQTaDTkH34XIo2tVcMJ29xPg4y','user',0,NULL);
INSERT INTO users VALUES(14,'Luca Massignani','lucmas','$2b$10$IIls3yn9Dybkn4JPQKJLg.2UfS4UP2D62u4ZbpeapgLEf2aPyR7tC','admin',0,'2026-07-17 20:23:39');
INSERT INTO users VALUES(15,'Ion Cainareanu','ioncai','$2b$10$ApNwHcdkaKm97IeqvnTNH.sJEpJuQ6c9cKjHlBoWt5qcHxmHs3sXi','user',0,NULL);
INSERT INTO users VALUES(16,'Alessio Bigon','alebig','$2b$10$cfbyt/7tIQPK7Cg0ovY6.eMNGp2o5A9TArSiqCjXuEIMZODVJ8.sq','user',0,NULL);
INSERT INTO users VALUES(17,'Matteo Kim Ly Thien','','','user',0,NULL);
COMMIT;
