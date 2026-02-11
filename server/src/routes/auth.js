import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";




const router = Router()

router.post('/signup', async (req,res) => {
    try {
        const {username, password} = req.body

        if(!username?.trim() || !password) {
            return res.status(400).json({ error: 'username and password are a MUST !'})
        }
        const exist = await User.findOne({username : username.trim()})
        if(exist) {
            return res.status(409).json({error: 'username already taken'})
        }
        const passwordHash = await bcrypt.hash(password, 12)
        const user = await User.create({username: username.trim(), passwordHash})
        return res.json({ok: true, user:{id: user._id, username: user.username}})
    } catch (err) {
        return res.status(500).json({error: 'server error !'})
    }
})



router.post('/login', async(req,res) => {
    try {
        const { username, password} = req.body

        if(!username?.trim() || !password) {
            return res.status(400).json({error: 'username and password are a MUST !'})
        }
        const user = await User.findOne({username: username.trim()})
        if (!user) {
            return res.status(401).json({error: 'invalid credentials'})
        }
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return res.status(401).json({error: 'invalid credentials'})
            const token = jwt.sign(
        {sub: user._id.toString(), username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '10d'}
    )
    return res.json({token, user: {id: user._id, username: user.username}})
    } catch (err) {
        return res.status(500).json({error: 'server error'})
    }
})
export default router