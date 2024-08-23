use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub name: String,      // 4+ STRING LENGTH
    pub avatar: String,    // 4+ 2048 (Largest url)
    pub bio: String,       //4 + STRING LEGTH(00 characters in bytes = 500)
    pub authority: Pubkey, //32
    pub last_post_id: u8,  //1
    pub post_count: u8,    //2
}

#[account]
#[derive(Default)]
pub struct PostAccount {
    pub id: u8,                  // 1 byte
    pub title: String, // 4 bytes for the length prefix + 256 bytes for the content = 260 bytes
    pub subtitle: String, // 4 bytes for the length prefix + 2048 bytes for the content = 2052 bytes
    pub image_preview: String, // 4 bytes for the length prefix + 2048 bytes for the content = 2052 bytes
    pub category: String, // 4 bytes for the length prefix + 50 bytes for the content = 54 bytes
    pub timestamp: i64,        // 8 bytes
    pub content: String, // 4 bytes for the length prefix + 64 bytes for the content = 68 bytes
    pub upvote: u8,      // 1 byte
    pub downvote: u8,    // 1 byte
    pub user: Pubkey,    // 32 bytes
    pub authority: Pubkey, // 32 bytes
    pub upvoters: Vec<Pubkey>, // list of users who have upvoted
    pub downvoters: Vec<Pubkey>, // list of users who have downvoted
}

