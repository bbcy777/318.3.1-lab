const express = require(`express`);
const router = express.Router();
const path = require(`path`);
const fs = require(`fs`);

const error = require(`../utilities/error`);
const commentsFilePath = path.join(__dirname, `../data/comments.js`);

router
  .route("/")
  .get((req, res) => {
    fs.readFile(commentsFilePath, (err, data) => {
        if(err){
            return next(error(500, 'No initial data yet'));
        }
        const comments = JSON.parse(data);
        const links = [
            {
              href: "comments/:id",
              rel: ":id",
              type: "GET",
            },
          ];
      
          res.json({ comments, links });
    });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {
        fs.readFile(commentsFilePath, (err, data) => {
            if (err) {
                return next(error(500, `internal server error`));
            }
            const comments = JSON.parse(data);
            let count = 1;
            if (comments.length > 0) {
                count = comments[comments.length - 1].id + 1
            }
            const comment = {
                id: count,
                userId: req.body.userId,
                postId: req.body.postId,
                body: req.body.body,
            };
    
            comments.push(comment);
        // Write updated comments back to the JSON file
            fs.writeFile(commentsFilePath, `module.exports = ${JSON.stringify(comments, null, 2)};`, err => {
                if (err) {
                return next(error(500, "Internal Server Error"));
                }
                res.json(comment);
            });
        });
     } else next(error(400, "Insufficient Data"));
  });

// router
//   .route("/:id")
//   .get((req, res, next) => {
//     const comment = comments.find((u) => u.id == req.params.id);

//     const links = [
//       {
//         href: `/${req.params.id}`,
//         rel: "",
//         type: "PATCH",
//       },
//       {
//         href: `/${req.params.id}`,
//         rel: "",
//         type: "DELETE",
//       },
//     ];

//     if (comment) res.json({ comment, links });
//     else next();
//   })
//   .patch((req, res, next) => {
//     const comment = comments.find((u, i) => {
//       if (u.id == req.params.id) {
//         for (const key in req.body) {
//           comments[i][key] = req.body[key];
//         }
//         return true;
//       }
//     });

//     if (comment) res.json(comment);
//     else next();
//   })
//   .delete((req, res, next) => {
//     const comment = comments.find((u, i) => {
//       if (u.id == req.params.id) {
//         comments.splice(i, 1);
//         return true;
//       }
//     });

//     if (comment) res.json(comment);
//     else next();
//   });

  module.exports = router;