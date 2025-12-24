exports.createComment = async (req, res) => {
    try {
        const { post, user, body } = req.body;

        if (!post || !user || !body) {
            return res.status(400).json({
                success: false,
                message: "post, user and body are required"
            });
        }

        const existingPost = await Post.findById(post);
        if (!existingPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = new Comment({ post, user, body });
        const savedComment = await comment.save();

        const updatedPost = await Post.findByIdAndUpdate(
            post,
            { $push: { comments: savedComment._id } },
            { new: true }
        ).populate("comments");

        return res.status(201).json({
            success: true,
            post: updatedPost
        });

    } catch (error) {
        console.error("Create Comment Error:", error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
