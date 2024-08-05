import React, { useState, useEffect } from "react";
import styles from "../[slug]/profile.module.css";
import Link from "next/link";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { HiCheckCircle } from "react-icons/hi";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import useProgram from "../../../hooks/user_program/load_program.js";
import { Modal } from "@/components/modal/modal";
import modalStyle from "@/components/modal/modal.module.css";

const ProfileHeader = ({ profileInfo, abbreviatedAddress, canEdit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("Anonymous User");
  const [bio, setBio] = useState("No bio available.");
  const [inWritingName, setInWritingName] = useState("");
  const [inWritingBio, setInWritingBio] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nameError, setNameError] = useState("");
  const [bioError, setBioError] = useState("");

  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (profileInfo) {
      setName(profileInfo.name || "Anonymous User");
      setBio(profileInfo.bio || "No bio available.");
      setInWritingName(profileInfo.name || "");
      setInWritingBio(profileInfo.bio || "");
    }
  }, [profileInfo]);

  const handleEditProfileClick = () => setShowEditModal(true);

  const handleCloseModal = () => setShowEditModal(false);
  const closeModal = () => setShowSuccessModal(false);

  const handleProfileChanges = async () => {
    if (inWritingName.trim() === "") {
      setNameError("Name cannot be empty");
      return;
    } else if (inWritingName.length > 256) {
      setNameError("Name cannot exceed 256 characters");
      return;
    } else {
      setNameError("");
    }

    if (inWritingBio.length > 1024) {
      setBioError("Bio cannot exceed 1024 characters");
      return;
    } else {
      setBioError("");
    }

    const editStatus = await editProfile(inWritingName, inWritingBio);

    if (editStatus) {
      setName(inWritingName);
      setBio(inWritingBio);
      setShowSuccessModal(true);
    }

    setShowEditModal(false);
  };

  const editProfile = async (name, bio) => {
    if (program && publicKey && connection) {
      try {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );

        await program.methods
          .editProfile(name, bio)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
          })
          .rpc();

        return true;
      } catch (error) {
        console.error("Error editing profile:", error);
        return false;
      }
    }
    return false;
  };

  if (!profileInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.avatar}></div>
      <div className={styles.profileInfo}>
        <h2>{name}</h2>
        <div className={styles.address}>
          <Link
            href={`https://solscan.io/account/${profileInfo.authority}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {abbreviatedAddress}
          </Link>
        </div>
        <div className={styles.bio}>
          <p>{bio}</p>
        </div>
      </div>

      {canEdit && (
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={handleEditProfileClick}
          >
            Edit Profile
          </button>
        </div>
      )}

      <Modal
        isOpen={showEditModal}
        closeModal={handleCloseModal}
        variant="transparent"
      >
        <div className={modalStyle.modalProfile}>
          <h1>Edit Profile</h1>
          <p>Edit your profile information below</p>
          <div className={modalStyle.articleInfo}>
            <div className={modalStyle.articleTextInfo}>
              <input
                type="text"
                value={inWritingName}
                onChange={(e) => setInWritingName(e.target.value)}
                placeholder="Name"
                className={modalStyle.textareaTitle}
              />
              {nameError && <p className={modalStyle.error}>{nameError}</p>}
              <textarea
                value={inWritingBio}
                onChange={(e) => setInWritingBio(e.target.value)}
                placeholder="Bio"
                className={modalStyle.textareaSubtitle}
              />
              {bioError && <p className={modalStyle.error}>{bioError}</p>}
            </div>
          </div>
          <div className={modalStyle.bottom}>
            <button
              className={modalStyle.saveEditProfile}
              onClick={handleProfileChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          closeModal={closeModal}
          variant="transparent"
        >
          <div>
            <HiCheckCircle className={modalStyle.icon} />
            <h1>Profile Updated Successfully!</h1>
            <p>Your profile information has been updated. Keep shining!</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfileHeader;
