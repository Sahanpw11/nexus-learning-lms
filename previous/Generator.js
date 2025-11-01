import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { 
  FaMagic, 
  FaDownload, 
  FaSpinner, 
  FaImage,
  FaCog,
  FaLightbulb
} from 'react-icons/fa';
import './Generator.css';

const Generator = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [useEnhancedPrompt, setUseEnhancedPrompt] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [settings, setSettings] = useState({
    width: 512,
    height: 512,
    steps: 40,
    guidance: 4.0,
    model: 'zavychroma',
    seed: null
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Aspect ratio presets
  const aspectRatios = {
    '1:1': { width: 512, height: 512, label: 'Square (1:1)' },
    '4:3': { width: 512, height: 384, label: 'Landscape (4:3)' },
    '3:4': { width: 384, height: 512, label: 'Portrait (3:4)' },
    '16:9': { width: 1280, height: 720, label: 'Widescreen (16:9)' },
    '9:16': { width: 720, height: 1280, label: 'Vertical (9:16)' },
    '3:2': { width: 1536, height: 1024, label: 'Photo (3:2)' },
    '2:3': { width: 1024, height: 1536, label: 'Portrait Photo (2:3)' },
    '21:9': { width: 1344, height: 576, label: 'Ultrawide (21:9)' },
    'custom': { width: settings.width, height: settings.height, label: 'Custom' }
  };
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');

  const samplePrompts = [
    "A majestic dragon soaring through cloudy mountains, digital art, fantasy, cinematic lighting",
    "Portrait of a cyberpunk samurai, neon lights, futuristic city background, highly detailed",
    "Serene landscape with cherry blossoms, lake reflection, sunset, oil painting style",
    "Abstract geometric patterns, vibrant colors, modern art, minimalist design"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatusMessage('Generating image...');
    setGeneratedImage(null);
    // Use enhanced prompt if checkbox is checked and enhanced prompt exists
    const promptToUse = useEnhancedPrompt && enhancedPrompt ? enhancedPrompt : prompt;
    try {
      const response = await axios.post(API_ENDPOINTS.GENERATE, {
        prompt: promptToUse,
        negative_prompt: negativePrompt,
        width: settings.width,
        height: settings.height,
        num_inference_steps: settings.steps,
        guidance_scale: settings.guidance,
        seed: settings.seed
      });
      if (response.data.status === 'success') {
        const imagePath = response.data.image_path.replace(/\\/g, '/');
        const filename = imagePath.split('/').pop();
        const cacheBuster = `?t=${Date.now()}`;
        const imageUrl = `http://localhost:8000/generated_images/${filename}${cacheBuster}`;
        setGeneratedImage(imageUrl);
        setStatusMessage('');
      } else {
        setStatusMessage('Generation failed');
      }
    } catch (error) {
      setStatusMessage('Generation failed');
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
    }
  };

  const enhancePrompt = async () => {
    if (!prompt.trim()) return;
    try {
      const response = await axios.post(API_ENDPOINTS.ENHANCE_PROMPT, {
        prompt: prompt
      });
      if (response.data.status === 'success' && response.data.enhanced_prompt) {
        setEnhancedPrompt(response.data.enhanced_prompt);
      }
    } catch (error) {}
  };

  const handleAspectRatioChange = (ratio) => {
    setSelectedAspectRatio(ratio);
    if (ratio !== 'custom') {
      const newDimensions = aspectRatios[ratio];
      setSettings({
        ...settings,
        width: newDimensions.width,
        height: newDimensions.height
      });
    }
  };

  const handleDimensionChange = (dimension, value) => {
    setSettings({...settings, [dimension]: Number(value)});
    setSelectedAspectRatio('custom');
  };

  return (
    <div className="generator">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="generator-header"
        >
          <h1 className="page-title">
            <FaMagic className="title-icon" />
            AI Image Generator
          </h1>
          <p className="page-subtitle">
            Transform your imagination into stunning visuals with ZavyChroma AI
          </p>
        </motion.div>

        <div className="generator-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="generator-panel"
          >
            <div className="panel-section">
              <div className="form-group">
                <label className="form-label">
                  Describe your image
                </label>
                <div className="prompt-input-container">
                  <textarea
                    className="form-input prompt-textarea"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A beautiful landscape with mountains and a lake, oil painting style..."
                    rows="4"
                  />
                  <button
                    className="enhance-btn"
                    onClick={enhancePrompt}
                    title="Enhance prompt with AI"
                  >
                    <FaLightbulb />
                  </button>
                </div>
              </div>

              {/* Enhanced Prompt Section */}
              {enhancedPrompt && (
                <div className="form-group">
                  <label className="form-label">Enhanced Prompt</label>
                  <div className="enhanced-prompt-container">
                    <textarea
                      className="form-input enhanced-prompt-display"
                      value={enhancedPrompt}
                      readOnly
                      rows="3"
                    />
                    <div className="enhanced-prompt-controls">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={useEnhancedPrompt}
                          onChange={(e) => setUseEnhancedPrompt(e.target.checked)}
                        />
                        Use enhanced prompt for generation
                      </label>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setPrompt(enhancedPrompt)}
                      >
                        Replace original
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="advanced-toggle">
                <button
                  className="toggle-btn"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <FaCog />
                  Advanced Settings
                </button>
              </div>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="advanced-settings"
                >
                  <div className="settings-grid">
                    <div className="form-group">
                      <label className="form-label">Aspect Ratio</label>
                      <select
                        className="form-input aspect-ratio-select"
                        value={selectedAspectRatio}
                        onChange={(e) => handleAspectRatioChange(e.target.value)}
                      >
                        {Object.entries(aspectRatios).map(([key, ratio]) => (
                          <option key={key} value={key}>
                            {ratio.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dimensions</label>
                      <div className="dimension-display">
                        <span className="dimension-text">
                          {settings.width} × {settings.height}
                        </span>
                        <div className="dimension-controls">
                          <input
                            type="number"
                            className="dimension-input"
                            value={settings.width}
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                            min="512"
                            max="2048"
                            step="64"
                          />
                          <span className="dimension-separator">×</span>
                          <input
                            type="number"
                            className="dimension-input"
                            value={settings.height}
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                            min="512"
                            max="2048"
                            step="64"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Steps: {settings.steps}</label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={settings.steps}
                        onChange={(e) => setSettings({...settings, steps: Number(e.target.value)})}
                        className="slider"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Guidance: {settings.guidance}</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={settings.guidance}
                        onChange={(e) => setSettings({...settings, guidance: Number(e.target.value)})}
                        className="slider"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seed (optional)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={settings.seed || ''}
                        onChange={(e) => setSettings({...settings, seed: e.target.value ? Number(e.target.value) : null})}
                        placeholder="Random seed for reproducible results"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Negative Prompt (optional)</label>
                      <textarea
                        className="form-input"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="blurry, low quality, distorted..."
                        rows="2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                className={`btn btn-primary generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <FaSpinner className="spinning" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FaMagic />
                    Generate Image
                  </>
                )}
              </button>
            </div>

            <div className="sample-prompts">
              <h3>Try these prompts:</h3>
              <div className="prompts-grid">
                {samplePrompts.map((sample, index) => (
                  <motion.button
                    key={index}
                    className="sample-prompt"
                    onClick={() => setPrompt(sample)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {sample}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="result-panel"
          >
            <div className="result-container">
              {isGenerating ? (
                <div className="generating-state">
                  <FaSpinner className="large-spinner spinning" />
                  <h3>Creating your masterpiece...</h3>
                  <p className="status-message">{statusMessage || "This may take a few moments"}</p>
                </div>
              ) : generatedImage ? (
                <div className="generated-result">
                  <img
                    src={generatedImage}
                    alt="Generated artwork"
                    className="generated-image"
                  />
                  <div className="result-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={handleDownload}
                    >
                      <FaDownload />
                      Download
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleGenerate}
                    >
                      <FaMagic />
                      Generate Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <FaImage className="empty-icon" />
                  <h3>Your generated image will appear here</h3>
                  <p>Enter a prompt and click generate to create amazing artwork</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="info-section"
        >
          <h2>About AI Image Generation</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Creative Freedom</h3>
              <p>Transform your ideas into stunning visuals with powerful AI technology</p>
            </div>
            <div className="info-card">
              <h3>Multiple Styles</h3>
              <p>Generate artwork in various styles from photorealistic to artistic interpretations</p>
            </div>
            <div className="info-card">
              <h3>High Resolution</h3>
              <p>Create detailed images with customizable dimensions and aspect ratios</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Generator;