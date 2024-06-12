const express = require(`express`);
const router = express.Router();
const path = require(`path`);
const fs = require(`fs`);

const error = require(`../utilities/error`);
const comments = require(`../data/comments`);

//function from chatGPT to read comments from file
function readComments(callback){
  fs.readFile(commentsFilePath, (err, data) => {
    if(err){
      //if file doesn't exist or error reading file, callback with empty array
      if (err.code === `ENOENT`) {
        callback(null, []);
      } else {
        callback(err);
      }
    } else {
      if (data.length === 0) {
        callback(null, [])
      } else {
        //Parse JSON data and callback with comments array
        const comments = JSON.parse(data);
        callback(null, comments);
      }
    }
  });
}

router
  .route("/")
  .get((req, res) => {
        const links = [
        {
            href: "comments/:id",
            rel: ":id",
            type: "GET",
        },
        ];
    
        res.json({ comments, links });
})
  .post((req, res, next) => {
    if (req.body.userId && req.body.postId && req.body.body) {

        const comment = {
            id: comments[comments.length - 1].id + 1,
            userId: req.body.userId,
            postId: req.body.postId,
            body: req.body.body,
        };

        comments.push(comment);
        res.json(comment);
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