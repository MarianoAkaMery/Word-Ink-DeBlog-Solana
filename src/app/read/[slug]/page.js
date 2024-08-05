"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./singlepage.module.css";
import useProgram from "../../../hooks/user_program/load_program";
import PostInfoTopBar from "../components/PostInfoTopBar";
import { HiArrowDown, HiArrowUp, HiShare, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Modal } from "@/components/modal/modal";
import modalStyle from "@/components/modal/modal.module.css";
import Dropdown from "@/components/dropdown/Dropdown";

// Function to generate the post URL based on the slug
const generatePostUrl = (slug) => {
  return `${window.location.origin}/posts/${slug}`;
};

// Share menu items with dynamic URL
const PostSinglePage = ({ params }) => {
  const { slug } = params;
  const [isVoting, setIsVoting] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [upVoters, setupVoters] = useState([]);
  const [downVoters, setdownVoters] = useState([]);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const [postSingle, setSinglePosts] = useState(null);
  const [postReadingTime, setpostReadingTime] = useState(0);
  const [abbreviatedAddress, setAbbreviatedAddress] = useState("");
  const [showUpvoteModal, setShowUpvoteModal] = useState(false);
  const [showRemoveUpvoteModal, setShowRemoveUpvoteModal] = useState(false);
  const [showDownvoteModal, setShowDownvoteModal] = useState(false);
  const [showRemoveDownvoteModal, setShowRemoveDownvoteModal] = useState(false);
  const [showAlreadyUpvotedModal, setShowAlreadyUpvotedModal] = useState(false);
  const [showAlreadyDownvotedModal, setShowAlreadyDownvotedModal] = useState(false);
  const { publicKey, connect } = useWallet();
  const { connection } = useConnection();
  const isFetched = useRef(false); // Track if data has been fetched

  const program = useProgram();

  // Dynamic URL based on the current post
  const url = generatePostUrl(slug);
  const text = "Check this article";

  // Share menu items with the dynamically generated URL
  const menuItems = [
    { label: 'Share on X', href: `https://x.com/intent/tweet?text=${text}: ${url}` },
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}` },
  ];

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    setpostReadingTime(minutes);
    return minutes;
  };

  const updateAbbreviatedAddress = (authority) => {
    if (authority) {
      const addr = authority.toString();
      const abbreviated = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
      setAbbreviatedAddress(abbreviated);
    }
  };

  const handleUpvote = async () => {
    setIsVoting(true);

    const upVoteStatus = await UpVote();
    console.log(upVoteStatus);
    if (!upVoteStatus.success) {
      if (upVoteStatus.reason === 'already_upvoted') {
        setShowAlreadyUpvotedModal(true);
      } else if (upVoteStatus.reason === 'user_rejected') {
        console.log('User rejected the request');
      } else {
        console.log('An unknown error occurred');
      }
    } else {
      const publicKeyStr = publicKey.toString();
      const downVotersStr = downVoters.map(voter => voter.toString());
      const upVotersStr = upVoters.map(voter => voter.toString());

      // Remove the user from downVoters if present
      if (downVotersStr.includes(publicKeyStr)) {
        setDownvoteCount((prevCount) => prevCount - 1);
        setdownVoters((prevDownVoters) => prevDownVoters.filter(voter => voter.toString() !== publicKeyStr));
      }

      // Add the user to upVoters if not already present
      if (!upVotersStr.includes(publicKeyStr)) {
        setUpvoteCount((prevCount) => prevCount + 1);
        setupVoters((prevUpVoters) => [...prevUpVoters, publicKeyStr]);
      }

      setShowUpvoteModal(true);
    }
    setIsVoting(false);
  };

  const handleDownvote = async () => {
    setIsVoting(true);

    const downVoteStatus = await DownVote();
    console.log(downVoteStatus);
    if (!downVoteStatus.success) {
      if (downVoteStatus.reason === 'already_downvoted') {
        setShowAlreadyDownvotedModal(true);
      } else if (downVoteStatus.reason === 'user_rejected') {
        console.log('User rejected the request');
      } else {
        console.log('An unknown error occurred');
      }
    } else {
      const publicKeyStr = publicKey.toString();
      const upVotersStr = upVoters.map(voter => voter.toString());
      const downVotersStr = downVoters.map(voter => voter.toString());

      // Remove the user from upVoters if present
      if (upVotersStr.includes(publicKeyStr)) {
        setUpvoteCount((prevCount) => prevCount - 1);
        setupVoters((prevUpVoters) => prevUpVoters.filter(voter => voter.toString() !== publicKeyStr));
      }

      // Add the user to downVoters if not already present
      if (!downVotersStr.includes(publicKeyStr)) {
        setDownvoteCount((prevCount) => prevCount + 1);
        setdownVoters((prevDownVoters) => [...prevDownVoters, publicKeyStr]);
      }

      setShowDownvoteModal(true);
    }
    setIsVoting(false);
  };

  const UpVote = async () => {
    if (program && publicKey && connection && !isVoting) {
      console.log("WE CAN UPVOTE");
      try {
        await program.methods
          .upvote()
          .accounts({
            postAccount: slug,
            authority: publicKey,
            voter: publicKey,
          })
          .rpc();

        console.log("Successfully Upvoted Post");
        return { success: true }; // Return true if successfully upvoted
      } catch (error) {
        console.log(error);
        if (error.message.includes('User rejected the request')) {
          return { success: false, reason: 'user_rejected' };
        } else if (error.message.includes('AlreadyUpvoted')) {
          return { success: false, reason: 'already_upvoted' };
        } else {
          return { success: false, reason: 'unknown' };
        }
      }
    } else {
      return { success: false, reason: 'preconditions_not_met' }; // Return false if preconditions are not met
    }
  };

  const RemoveUpvote = async () => {
    if (program && publicKey && connection && !isVoting) {
      console.log("WE CAN REMOVE-UPVOTE");
      try {
        await program.methods
          .removeUpvote()
          .accounts({
            postAccount: slug,
            authority: publicKey,
            voter: publicKey,
          })
          .rpc();

        console.log("Successfully REMOVE-UPVOTE Post");
        return { success: true }; // Return true if successfully upvoted
      } catch (error) {
        console.log(error);
        if (error.message.includes('User rejected the request')) {
          return { success: false, reason: 'user_rejected' };
        } else if (error.message.includes('NotUpvoted')) { // Adjust this condition based on actual error message
          return { success: false, reason: 'not_upvoted' };
        } else {
          return { success: false, reason: 'unknown' };
        }
      }
    } else {
      return { success: false, reason: 'preconditions_not_met' }; // Return false if preconditions are not met
    }
  };

  const DownVote = async () => {
    if (program && publicKey && connection && !isVoting) {
      console.log("WE CAN DOWNVOTE");
      try {
        await program.methods
          .downvote()
          .accounts({
            postAccount: slug,
            authority: publicKey,
            voter: publicKey,
          })
          .rpc();

        console.log("Successfully Downvoted Post");
        return { success: true }; // Return true if successfully downvoted
      } catch (error) {
        console.log(error);
        if (error.message.includes('User rejected the request')) {
          return { success: false, reason: 'user_rejected' };
        } else if (error.message.includes('AlreadyDownvoted')) {
          return { success: false, reason: 'already_downvoted' };
        } else {
          return { success: false, reason: 'unknown' };
        }
      }
    } else {
      return { success: false, reason: 'preconditions_not_met' }; // Return false if preconditions are not met
    }
  };

  const RemoveDownVote = async () => {
    if (program && publicKey && connection && !isVoting) {
      console.log("WE CAN REMOVE-DOWNVOTE");
      try {
        await program.methods
          .removeDownvote()
          .accounts({
            postAccount: slug,
            authority: publicKey,
            voter: publicKey,
          })
          .rpc();

        console.log("Successfully REMOVE-DOWNVOTE Post");
        return { success: true }; // Return true if successfully downvoted
      } catch (error) {
        console.log(error);
        if (error.message.includes('User rejected the request')) {
          return { success: false, reason: 'user_rejected' };
        } else if (error.message.includes('NotDownvoted')) { // Adjust this condition based on actual error message
          return { success: false, reason: 'not_downvoted' };
        } else {
          return { success: false, reason: 'unknown' };
        }
      }
    } else {
      return { success: false, reason: 'preconditions_not_met' }; // Return false if preconditions are not met
    }
  };

  useEffect(() => {
    const fetchPostData = async () => {
      if (slug && !isFetched.current) {
        isFetched.current = true;
        // Fetch post data logic here
        // Example: const data = await fetchPost(slug);
        // setSinglePosts(data);
        // calculateReadingTime(data.content);
      }
    };
    fetchPostData();
  }, [slug]);

  return (
    <div className={styles.container}>
      <PostInfoTopBar
        postSingle={postSingle}
        abbreviatedAddress={abbreviatedAddress}
        readingTime={postReadingTime}
      />
      <div className={styles.horizontalDivider}></div>
      <div className={styles.section}>

        <div className={styles.reactions}>
          <div className={styles.votes}>
            <button
              className={styles.react}
              onClick={handleUpvote}
              disabled={isVoting}
            >
              <HiArrowUp />
              <span>{upvoteCount}</span>
            </button>

            <button
              className={styles.react}
              onClick={handleDownvote}
              disabled={isVoting}
            >
              <HiArrowDown />
              <span>{downvoteCount}</span>
            </button>
          </div>
          <div>
            <Dropdown menuItems={menuItems}>
              <HiShare className={styles.icon} />
            </Dropdown>
          </div>
        </div>
      </div>
      <div className={styles.horizontalDivider}></div>
      <div
        className={styles.textContainer}
        dangerouslySetInnerHTML={{ __html: postSingle?.content }}
      />

      {/* Modals */}
      <ActionModal
        isOpen={showUpvoteModal}
        closeModal={() => setShowUpvoteModal(false)}
        message={{ title: "Upvote Successful", body: "You have upvoted this post!" }}
        Icon={HiCheckCircle}
      />
      <ActionModal
        isOpen={showRemoveUpvoteModal}
        closeModal={() => setShowRemoveUpvoteModal(false)}
        message={{ title: "Upvote Removed", body: "You have removed your upvote!" }}
        Icon={HiCheckCircle}
      />
      <ActionModal
        isOpen={showDownvoteModal}
        closeModal={() => setShowDownvoteModal(false)}
        message={{ title: "Downvote Successful", body: "You have downvoted this post!" }}
        Icon={HiCheckCircle}
      />
      <ActionModal
        isOpen={showRemoveDownvoteModal}
        closeModal={() => setShowRemoveDownvoteModal(false)}
        message={{ title: "Downvote Removed", body: "You have removed your downvote!" }}
        Icon={HiCheckCircle}
      />
      <ActionModal
        isOpen={showAlreadyUpvotedModal}
        closeModal={() => setShowAlreadyUpvotedModal(false)}
        message={{ title: "Already Upvoted", body: "You have already upvoted this post." }}
        Icon={HiExclamationCircle}
        actionButton={{
          text: "Remove Upvote",
          onClick: async () => {
            const removeUpvoteStatus = await RemoveUpvote();
            if (removeUpvoteStatus.success) {
              setUpvoteCount((prevCount) => prevCount - 1);
              setShowRemoveUpvoteModal(true);
              setShowAlreadyUpvotedModal(false);
            }
          }
        }}
      />
      <ActionModal
        isOpen={showAlreadyDownvotedModal}
        closeModal={() => setShowAlreadyDownvotedModal(false)}
        message={{ title: "Already Downvoted", body: "You have already downvoted this post." }}
        Icon={HiExclamationCircle}
        actionButton={{
          text: "Remove Downvote",
          onClick: async () => {
            const removeDownVoteStatus = await RemoveDownVote();
            if (removeDownVoteStatus.success) {
              setDownvoteCount((prevCount) => prevCount - 1);
              setShowRemoveDownvoteModal(true);
              setShowAlreadyDownvotedModal(false);
            }
          }
        }}
      />
    </div>
  );
};

const ActionModal = ({ isOpen, closeModal, message, Icon, actionButton }) => (
  <Modal isOpen={isOpen} closeModal={closeModal} className={modalStyle.modal}>
    <div className={modalStyle.modalContent}>
      <Icon className={modalStyle.modalIcon} />
      <h2 className={modalStyle.modalTitle}>{message.title}</h2>
      <p className={modalStyle.modalBody}>{message.body}</p>
      {actionButton && (
        <button onClick={actionButton.onClick} className={modalStyle.actionButton}>
          {actionButton.text}
        </button>
      )}
      <button onClick={closeModal} className={modalStyle.closeButton}>Close</button>
    </div>
  </Modal>
);

export default PostSinglePage;
