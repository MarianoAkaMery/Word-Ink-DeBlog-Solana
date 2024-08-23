use anchor_lang::prelude::*;
pub mod constant;
pub mod states;

use crate::{constant::*, states::*};

declare_id!("76mXczffr19sHq5tQ4UoB8ApBzSXfQFyfRccN6tTekmS");

#[program]
pub mod solana_blog {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let authority = &mut ctx.accounts.authority;

        user_account.name = "".to_string();
        user_account.avatar = "".to_string();
        user_account.bio = "".to_string();
        user_account.last_post_id = 0;
        user_account.post_count = 0;
        user_account.authority = authority.key();

        Ok(())
    }

    pub fn create_post(
        ctx: Context<CreatePost>,
        title: String,
        subtitle: String,
        category: String,
        image_preview: String,
        content: String,
    ) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let user_account = &mut ctx.accounts.user_account;
        let authority = &ctx.accounts.authority;

        // Length checks
        if title.len() > 256 {
            return Err(ErrorCode::TitleTooLong.into());
        }
        if subtitle.len() > 2048 {
            return Err(ErrorCode::SubtitleTooLong.into());
        }
        if image_preview.len() > 2048 {
            return Err(ErrorCode::ImagePreviewTooLong.into());
        }
        if content.len() > 64 {
            return Err(ErrorCode::ContentTooLong.into());
        }

        post_account.id = user_account.last_post_id;
        post_account.title = title;
        post_account.subtitle = subtitle;
        post_account.category = category;
        post_account.timestamp = Clock::get()?.unix_timestamp;
        post_account.image_preview = image_preview;
        post_account.upvote = 0;
        post_account.downvote = 0;
        post_account.content = content;
        post_account.user = user_account.key();
        post_account.authority = authority.key();

        user_account.last_post_id = user_account.last_post_id.checked_add(1).unwrap();
        user_account.post_count = user_account.post_count.checked_add(1).unwrap();

        Ok(())
    }
    pub fn upvote(ctx: Context<ModifyVote>) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let voter = &ctx.accounts.voter.key();

        // Check if the user has already upvoted
        if post_account.upvoters.contains(voter) {
            return Err(ErrorCode::AlreadyUpvoted.into());
        }

        // If the user has downvoted before, remove their downvote
        if let Some(pos) = post_account.downvoters.iter().position(|&x| x == *voter) {
            post_account.downvoters.remove(pos);
            post_account.downvote = post_account.downvote.checked_sub(1).unwrap();
        }

        // Add the user's upvote
        post_account.upvoters.push(*voter);
        post_account.upvote = post_account.upvote.checked_add(1).unwrap();

        Ok(())
    }

    pub fn remove_upvote(ctx: Context<ModifyVote>) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let voter = &ctx.accounts.voter.key();

        // Check if the user has upvoted
        if let Some(pos) = post_account.upvoters.iter().position(|&x| x == *voter) {
            post_account.upvoters.remove(pos);
            post_account.upvote = post_account.upvote.checked_sub(1).unwrap();
        } else {
            return Err(ErrorCode::NotUpvoted.into());
        }

        Ok(())
    }
    pub fn downvote(ctx: Context<ModifyVote>) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let voter = &ctx.accounts.voter.key();

        // Check if the user has already downvoted
        if post_account.downvoters.contains(voter) {
            return Err(ErrorCode::AlreadyDownvoted.into());
        }

        // If the user has upvoted before, remove their upvote
        if let Some(pos) = post_account.upvoters.iter().position(|&x| x == *voter) {
            post_account.upvoters.remove(pos);
            post_account.upvote = post_account.upvote.checked_sub(1).unwrap();
        }

        // Add the user's downvote
        post_account.downvoters.push(*voter);
        post_account.downvote = post_account.downvote.checked_add(1).unwrap();

        Ok(())
    }

    pub fn remove_downvote(ctx: Context<ModifyVote>) -> Result<()> {
        let post_account = &mut ctx.accounts.post_account;
        let voter = &ctx.accounts.voter.key();

        // Check if the user has downvoted
        if let Some(pos) = post_account.downvoters.iter().position(|&x| x == *voter) {
            post_account.downvoters.remove(pos);
            post_account.downvote = post_account.downvote.checked_sub(1).unwrap();
        } else {
            return Err(ErrorCode::NotDownvoted.into());
        }

        Ok(())
    }

    pub fn edit_profile(ctx: Context<EditProfile>, name: String, bio: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let authority = &ctx.accounts.authority;

        // Length checks
        if name.len() > 256 {
            return Err(ErrorCode::NameTooLong.into());
        }
        if bio.len() > 1024 {
            return Err(ErrorCode::BioTooLong.into());
        }

        user_account.name = name;
        user_account.bio = bio;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct ModifyVote<'info> {
    #[account(mut)]
    pub post_account: Account<'info, PostAccount>,
    pub authority: Signer<'info>,
    pub voter: Signer<'info>,
}

impl<'info> ModifyVote<'info> {
    pub fn validate(&self) -> Result<()> {
        // Ensure the authority is the one allowed to modify the post
        if *self.authority.key != self.post_account.authority {
            return Err(ErrorCode::Unauthorized.into());
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct EditProfile<'info> {
    #[account(
        mut,
        seeds =[USER_SEED, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 2312 + 8
    )]
    //qui si usa il seed per creare l'account
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreatePost<'info> {
    #[account(
        init,
        seeds = [POST_SEED, authority.key().as_ref(), &[user_account.last_post_id as u8].as_ref()],
        bump,
        payer = authority,
        space = 5469 + 8
    )]
    pub post_account: Account<'info, PostAccount>,

    #[account(
        mut,
        seeds =[USER_SEED, authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The title is too long")]
    TitleTooLong,
    #[msg("The subtitle is too long")]
    SubtitleTooLong,
    #[msg("The image preview URL is too long")]
    ImagePreviewTooLong,
    #[msg("The content is too long")]
    ContentTooLong,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Already upvoted")]
    AlreadyUpvoted,
    #[msg("Not upvoted")]
    NotUpvoted,
    #[msg("Already downvoted")]
    AlreadyDownvoted,
    #[msg("Not downvoted")]
    NotDownvoted,
    #[msg("The name is too long")]
    NameTooLong,
    #[msg("The bio is too long")]
    BioTooLong,
}

