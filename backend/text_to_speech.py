from transformers import pipeline
import soundfile as sf
import numpy as np
import io

# Load model
tts = pipeline("text-to-speech", model="suno/bark")

def synthesize_speech(text: str) -> bytes:
    """
    Converts text to speech and returns WAV bytes.
    """
    output = tts(text)
    audio = output["audio"]
    sample_rate = output["sampling_rate"]
    
    # scipy.io.wavfile.write("bark_out.wav", rate=speech["sampling_rate"], data=speech["audio"])

    # Convert to WAV in memory
    buf = io.BytesIO()
    sf.write(buf, audio, sample_rate, format="WAV", subtype="PCM_16")
    buf.seek(0)
    return buf.read()
