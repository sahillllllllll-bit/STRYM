import logo from './logo.svg.png'
import sample_cover from './sample_cover.jpg'
import sample_profile from './sample_profile.jpg'
import bgImage from './bgImage.png'
import group_users from './group_users.png'
import { Home, MessageCircle, Search, UserIcon, Users, Projector, SunMoon, Bot } from 'lucide-react'
import sponsored_img from './sponsored_img.png'

export const assets = {
    logo,
    sample_cover,
    sample_profile,
    bgImage,
    group_users,
    sponsored_img
}

export const menuItemsData = [
    { to: '/', label: 'Feed', Icon: Home },
    { to: '/discover', label: 'Search', Icon: Search },
    { to: '/minto', label: 'Minto - Short Videos', Icon: Projector },
    { to: '/strym-ai', label: 'STRYM-AI', Icon: Bot },
    { to: '/connections', label: 'Followers/Followings', Icon: Users },
    { to: '/messages', label: 'Messages', Icon: MessageCircle },
    { to: '/profile', label: 'Profile', Icon: UserIcon },
    { to: '/theme', label: 'Change Theme', Icon: SunMoon },
]

export const dummyUserData = {
    "_id": "user_1",
    "email": "admin@example.com",
    "full_name": "John Warren",
    "username": "john_warren",
    "bio": "🌍 Dreamer | 📚 Learner | 🚀 Doer\r\nExploring life one step at a time.\r\n✨ Staying curious. Creating with purpose.",
    "profile_picture": sample_profile,
    "cover_photo": sample_cover,
    "location": "Deoria,India",
    "followers": ["user_2", "user_3"],
    "following": ["user_2", "user_3"],
    "connections": ["user_2", "user_3"],
    "posts": [],
    "is_verified": true,
    "createdAt": "2025-07-09T09:26:59.231Z",
    "updatedAt": "2025-07-21T06:56:50.017Z",
}

const dummyUser2Data = {
    ...dummyUserData,
    _id: "user_2",
    username: "Richard Hendricks",
    full_name: "Richard Hendricks",
    profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
}

const dummyUser3Data = {
    ...dummyUserData,
    _id: "user_3",
    username: "alexa_james",
    full_name: "Alexa James",
    profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
}

const dummyUser4Data = {
    ...dummyUserData,
    _id: "user_4",
    username: "sahilx__!",
    full_name: "Sahil Singh",
    profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
}

const dummyUser5Data = {
    ...dummyUserData,
    _id: "user_5",
    username: "Shivani_raj",
    full_name: "Shivani Singh",
    profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
}

const dummyUser6Data = {
    ...dummyUserData,
    _id: "user_6", // ✅ FIXED: was user_3 before
    username: "alex_james_alt",
    full_name: "Alex James Alt",
    profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
}

export const dummyStoriesData = [
    {
        "_id": "story_1",
        "user": dummyUserData,
        "content": "📌 This isn't the story I wanted to tell… not yet.",
        "media_url": "",
        "media_type": "text",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:16:06.958Z",
        "updatedAt": "2025-07-25T08:16:06.958Z",
    },
    {
        "_id": "story_2",
        "user": dummyUserData,
        "content": "sahil singh",
        "media_url": "https://videos.pexels.com/video-files/5469583/5469583-uhd_1440_2560_30fps.mp4",
        "media_type": "video",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:27:48.134Z",
        "updatedAt": "2025-07-25T08:27:48.134Z",
    },
    {
        "_id": "story_3",
        "user": dummyUserData,
        "content": "sahil singh",
        "media_url": "https://videos.pexels.com/video-files/6616833/6616833-hd_1080_1920_25fps.mp4",
        "media_type": "video",
        "background_color": "#4f46e5",
        "createdAt": "2025-08-12T08:27:21.289Z",
        "updatedAt": "2025-07-25T08:27:21.289Z",
    },
    {
        "_id": "story_4",
        "user": dummyUserData,
        "content": " sahil singh",
        "media_url": "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg",
        "media_type": "image",
        "background_color": "#4f46e5",
        "createdAt": "2025-07-25T08:19:31.080Z",
        "updatedAt": "2025-07-25T08:19:31.080Z",
    },
]

export const dummyPostsData = [
    {
        "_id": "post_1",
        "user": dummyUserData,
        "content": "We're a small #team with a big vision...",
        "image_urls": ["https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg"],
        "post_type": "text_with_image",
        "likes_count": [],
        "createdAt": "2025-07-16T05:54:31.191Z",
        "updatedAt": "2025-07-16T05:54:31.191Z",
    },
    {
        "_id": "post_2",
        "user": dummyUserData,
        "content": "Unlock your potential—every small step counts...",
        "image_urls": [],
        "post_type": "text",
        "likes_count": [],
        "createdAt": "2025-07-09T13:22:12.601Z",
        "updatedAt": "2025-07-09T13:22:12.601Z",
    },
]

export const dummyRecentMessagesData = [
    {
        "_id": "msg_1",
        "from_user_id": dummyUser3Data,
        "to_user_id": dummyUserData,
        "text": "babe, i'm suffosicated!",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-10T12:47:40.510Z",
        "updatedAt": "2025-07-10T12:47:40.510Z",
        "seen": false
    },
    {
        "_id": "msg_2",
        "from_user_id": dummyUser2Data,
        "to_user_id": dummyUserData,
        "text": "I love you babe 🩷 ",
        "message_type": "text",
        "media_url": "",
        "seen": true,
        "createdAt": "2025-07-25T08:06:14.436Z",
        "updatedAt": "2025-07-25T08:47:47.768Z",
    },
    {
        "_id": "msg_3",
        "from_user_id": dummyUser2Data,
        "to_user_id": dummyUserData,
        "text": "I seen your profile",
        "message_type": "text",
        "media_url": "",
        "seen": true,
        "createdAt": "2025-07-25T08:06:14.436Z",
        "updatedAt": "2025-07-25T08:47:47.768Z",
    },
    {
        "_id": "msg_4",
        "from_user_id": dummyUserData,
        "to_user_id": dummyUserData,
        "text": "This is a Samsung Tablet",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-17T10:11:08.437Z",
        "updatedAt": "2025-07-25T08:07:11.893Z",
        "seen": false,
    },
    {
        "_id": "msg_5",
        "from_user_id": dummyUser2Data,
        "to_user_id": dummyUserData,
        "text": "You are so good, do you?",
        "message_type": "text",
        "media_url": "",
        "seen": false,
        "createdAt": "2025-07-25T08:06:14.436Z",
        "updatedAt": "2025-07-25T08:47:47.768Z",
    },
    {
        "_id": "msg_6",
        "from_user_id": dummyUser3Data,
        "to_user_id": dummyUserData,
        "text": "how are you",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-10T12:47:40.510Z",
        "updatedAt": "2025-07-10T12:47:40.510Z",
        "seen": false
    }
]

export const dummyMessagesData = [
    {
        "_id": "dm_1",
        "from_user_id": "user_2",
        "to_user_id": "user_1",
        "text": "",
        "message_type": "image",
        "media_url": "https://images.pexels.com/photos/106341/pexels-photo-106341.jpeg",
        "createdAt": "2025-07-17T10:10:58.524Z",
        "updatedAt": "2025-07-25T10:43:50.346Z",
        "seen": true
    },
    {
        "_id": "dm_2",
        "from_user_id": "user_2",
        "to_user_id": "user_1",
        "text": "This is a Samsung Tablet",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-07-17T10:11:08.437Z",
        "updatedAt": "2025-07-25T10:43:50.346Z",
        "seen": true
    },
    {
        "_id": "dm_3",
        "from_user_id": "user_1",
        "to_user_id": "user_2",
        "text": "yah , this tablet is good",
        "message_type": "text",
        "media_url": "",
        "seen": false,
        "createdAt": "2025-07-25T10:44:12.753Z",
        "updatedAt": "2025-07-25T10:44:12.753Z",
    },
    {
        "_id": "dm_4",
        "from_user_id": "user_1",
        "to_user_id": "user_2",
        "text": "you can purchase it from amazon",
        "message_type": "text",
        "media_url": "",
        "createdAt": "2025-08-17T10:10:48.956Z",
        "updatedAt": "2025-08-25T10:43:50.346Z",
        "seen": true
    },
]

export const dummyConnectionsData = [
    dummyUserData,
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
    dummyUser6Data
]

export const dummyFollowersData = [
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
    dummyUser6Data
]

export const dummyFollowingData = [
    dummyUser2Data,
    dummyUser3Data,
    dummyUser4Data,
    dummyUser5Data,
]

export const dummyPendingConnectionsData = [
    dummyUserData,
    dummyUser5Data,
]
