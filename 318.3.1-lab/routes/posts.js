const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");
const comments = require("../data/comments");

// const users = require(`../data/users`);

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
      {
        href: "posts/:id/comments",
        rel: ":id",
        type: "GET",
      },
      {
        href: "posts/:id/comments/userId",
        rel: ":id",
        type: "GET",
      },
    ];
    const userId = req.query.userId;
    if(!userId) {
      res.json({ posts, links });
    } else {
      const userPost = posts.filter(post => post.userId == userId);
      res.json({ userPost, links})
    }
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router
  .route(`/:id/comments`)
  .get((req, res, next) => {
    const links = [
      {
        href: `/`,
        rel: "",
        type: "GET",
      },
      {
        href: `/${req.params.id}?userId=<value>`,
        rel: "",
        type: "GET",
      },
    ]
    const post = posts.find((p) => p.id == req.params.id);
    const postComment = comments.filter(comment => post.id == comment.postId);
    const userId = req.query.userId;

    if (userId && postComment) {
      const postCommentUser = postComment.filter(comment => comment.userId == userId);
      if (postCommentUser) res.json({ postCommentUser, links});
    } else if (postComment) {
      res.json( {postComment, links});
    } else next();
  })

module.exports = router;
