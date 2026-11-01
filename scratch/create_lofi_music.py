# -*- coding: utf-8 -*-
import subprocess
import os

input_file = "music/là vì em.original.mp3"
output_file = "music/là vì em.lofi.mp3"

# Lo-Fi filter chain:
# 1. lowpass=f=3800: gentle roll-off of harsh high frequencies for that cozy lo-fi texture
# 2. bass=g=3:f=140: cozy warm low end
# 3. equalizer=f=2800:t=q:w=1.5:g=-3.5: soften presence peaks
# 4. acompressor=threshold=-16dB:ratio=2.5:attack=25:release=200: soft compression for chill dynamics
# 5. afade=t=in:ss=0:d=2: smooth 2s fade in on load
# 6. volume=0.82: gentle listening level
filter_chain = "lowpass=f=3800,bass=g=3:f=140,equalizer=f=2800:t=q:w=1.5:g=-3.5,acompressor=threshold=-16dB:ratio=2.5:attack=25:release=200,afade=t=in:ss=0:d=2,volume=0.82"

cmd = [
    "ffmpeg", "-y",
    "-i", input_file,
    "-af", filter_chain,
    "-c:a", "libmp3lame",
    "-b:a", "192k",
    output_file
]

print("Running FFmpeg with Lo-Fi filter chain...")
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully created Lo-Fi version!")
    # Replace the active music file
    os.replace("music/là vì em.lofi.mp3", "music/là vì em.mp3")
    print("Replaced music/là vì em.mp3 with Lo-Fi version.")
else:
    print("FFmpeg error:", res.stderr)

