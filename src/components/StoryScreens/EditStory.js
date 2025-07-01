import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Loader from "../GeneralScreens/Loader";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from "react-icons/ai";
import "../../Css/EditStory.css";
import "../../Css/Privacy.css";
import "../../Css/AddStory.css"; // Import for progress bar styles

const EditStory = () => {
  const { config, activeUser } = useContext(AuthContext);
  const slug = useParams().slug;
  const imageEl = useRef(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState({});
  const [image, setImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isAdminEdit, setIsAdminEdit] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getStoryInfo = async () => {
      setLoading(true);
      try {
        // Try regular route first
        let response;
        try {
          response = await axios.get(`/story/editStory/${slug}`, config);
        } catch (error) {
          // If regular route fails and user is admin, try admin route
          if (activeUser?.role === 'admin') {
            response = await axios.get(`/admin/editStory/${slug}`, config);
            setIsAdminEdit(true);
          } else {
            throw error;
          }
        }

        setStory(response.data.data);
        setTitle(response.data.data.title);
        setContent(response.data.data.content);
        setPrivacy(response.data.data.privacy || "public");
        setImage(response.data.data.image);
        setPreviousImage(response.data.data.image);
        setLoading(false);
      } catch (error) {
        navigate("/");
      }
    };
    getStoryInfo();
  }, [activeUser, config, navigate, slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("image", image);
    formdata.append("previousImage", previousImage);
    formdata.append("privacy", privacy);

    try {
      setUploadStatus('Preparing update...');
      setUploadProgress(10);

      // Use admin route if this is an admin edit
      const endpoint = isAdminEdit
        ? `/admin/stories/${slug}/edit`
        : `/story/${slug}/edit`;

      // Create config with progress tracking
      const uploadConfig = {
        ...config,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percentCompleted);

          if (percentCompleted < 30) {
            setUploadStatus('Uploading changes...');
          } else if (percentCompleted < 70) {
            setUploadStatus(isVideo ? 'Processing video...' : 'Processing media...');
          } else if (percentCompleted < 95) {
            setUploadStatus('Finalizing update...');
          } else {
            setUploadStatus('Almost done...');
          }
        }
      };

      await axios.put(endpoint, formdata, uploadConfig);

      setUploadProgress(100);
      setUploadStatus('Story updated successfully!');

      const successMessage = isAdminEdit
        ? "Story edited successfully (Admin)"
        : "Story updated successfully!";

      setSuccess(successMessage);

      setTimeout(() => {
        navigate(`/story/${slug}`);
      }, 1500);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');

      setTimeout(() => {
        setError("");
      }, 4500);
      setError(error.response?.data?.error || "Failed to update story");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="Inclusive-editStory-page ">
          <form onSubmit={handleSubmit} className="editStory-form">
            {isAdminEdit && (
              <div className="admin-edit-notice">
                <strong>Admin Mode:</strong> You are editing this story as an administrator.
                <br />
                <small>Original author: {story.author?.username || 'Unknown'}</small>
              </div>
            )}
            {error && <div className="error_msg">{error}</div>}
            {success && (
              <div className="success_msg">
                <span>{success}</span>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="upload-progress-container">
                <div className="upload-status">
                  <span>{uploadStatus}</span>
                  <span className="progress-percentage">{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                {isVideo && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-note">
                    <small>Video processing may take a moment...</small>
                  </div>
                )}
              </div>
            )}

            <input
              type="text"
              required
              id="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <CKEditor
              editor={ClassicEditor}
              onChange={(e, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
              data={content}
            />

            <div className="privacy-selector">
              <label>Who can see this story?</label>
              <div className="privacy-options">
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={privacy === 'public'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>Public - Everyone can see this story</span>
                </label>
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="user"
                    checked={privacy === 'user'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>Registered Users - Only logged-in users can see this story</span>
                </label>
                <label className="privacy-option">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={privacy === 'private'}
                    onChange={(e) => setPrivacy(e.target.value)}
                  />
                  <span>Private - Only you and admins can see this story</span>
                </label>
              </div>
            </div>

            <div class="currentlyImage">
              <div class="absolute">Currently Image</div>
              <img
                src={`/storyImages/${previousImage}`}
                alt="storyImage"
              />
            </div>
            <div class="StoryImageField">
              <AiOutlineUpload />
              <div class="txt">
                {image === previousImage
                  ? "    Change the image in your story "
                  : image.name}
              </div>
              <input
                name="image"
                type="file"
                accept="image/*,video/*"
                ref={imageEl}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Check for problematic filename characters
                    const problematicChars = /[🥶📚✅🔥#@$%^&*()+=\[\]{}|\\:";'<>?,]/;
                    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

                    if (problematicChars.test(file.name) || hasEmojis.test(file.name)) {
                      setError('Filename contains special characters or emojis that may cause upload issues. The system will automatically clean the filename during upload.');
                      setTimeout(() => setError(''), 5000);
                    }

                    setImage(file);
                    setIsVideo(file.type.startsWith('video/'));
                  }
                }}
              />
            </div>

            <button
              type="submit"
              className={`editStory-btn ${isUploading ? 'uploading' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Updating...
                </span>
              ) : (
                'Update Story'
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditStory;
