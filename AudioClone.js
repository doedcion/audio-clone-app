import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AudioClone() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [synthesizedAudioURL, setSynthesizedAudioURL] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pitch', pitch);
    formData.append('speed', speed);

    try {
      const response = await fetch('/api/clone-audio', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAudioURL(data.audio_url);
    } catch (error) {
      console.error('Error cloning audio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!text) return;
    setLoading(true);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSynthesizedAudioURL(data.audio_url);
    } catch (error) {
      console.error('Error synthesizing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-xl font-bold mb-4'>音频克隆与合成工具</h1>
      <Input type='file' accept='audio/*' onChange={handleFileChange} />
      <div className='mt-4'>
        <label>音调调整:</label>
        <Slider min={0.5} max={2} step={0.1} value={pitch} onChange={setPitch} />
      </div>
      <div className='mt-4'>
        <label>语速调整:</label>
        <Slider min={0.5} max={2} step={0.1} value={speed} onChange={setSpeed} />
      </div>
      <Button className='mt-4' onClick={handleUpload} disabled={loading}>
        {loading ? '处理中...' : '上传并克隆'}
      </Button>
      {audioURL && (
        <div className='mt-6'>
          <audio controls>
            <source src={audioURL} type='audio/mpeg' />
            您的浏览器不支持音频播放。
          </audio>
          <a href={audioURL} download='cloned_audio.mp3' className='block mt-2 text-blue-500'>下载克隆音频</a>
        </div>
      )}
      <hr className='my-6' />
      <h2 className='text-lg font-semibold'>文本转语音</h2>
      <Textarea placeholder='输入文本以合成语音' value={text} onChange={(e) => setText(e.target.value)} />
      <Button className='mt-4' onClick={handleTextToSpeech} disabled={loading}>
        {loading ? '处理中...' : '合成语音'}
      </Button>
      {synthesizedAudioURL && (
        <div className='mt-6'>
          <audio controls>
            <source src={synthesizedAudioURL} type='audio/mpeg' />
            您的浏览器不支持音频播放。
          </audio>
          <a href={synthesizedAudioURL} download='synthesized_audio.mp3' className='block mt-2 text-blue-500'>下载合成语音</a>
        </div>
      )}
    </div>
  );
}
