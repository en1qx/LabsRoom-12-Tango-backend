import CommentModel from '../models/Comment.js';

// Get all comments for post
export const getComments = async (req, res) => {
    try {
        const {postId} = req.params;

        const comments = await CommentModel.find({post: postId}).populate('user').exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список комментариев'
        });
    }
}

// Create comment by post id, user id and text
export const createComment = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId,
            post: req.params.postId,
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        });
    }
}
