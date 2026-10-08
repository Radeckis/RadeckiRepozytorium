import { LightningElement } from 'lwc';
import drivinUrl from '@salesforce/resourceUrl/Drivin';

export default class Bity extends LightningElement {
    trackTitle = 'prodRanchdo - She (slowed+reverb)';
    audioEl;
    canvasEl;
    canvasCtx;
    trackUrl = drivinUrl;
    isPlaying = false;
    seekValue = 0;

    audioCtx;
    analyser;
    rafId;

    renderedCallback() {
        if (!this.audioEl) {
            this.audioEl = this.template.querySelector('.audioPlayer');
            this.audioEl.src = this.trackUrl;
            this.audioEl.addEventListener('timeupdate', () => {
                if (this.audioEl.duration) {
                    this.seekValue = (this.audioEl.currentTime / this.audioEl.duration) * 1000;
                }
            });
        }
        if (!this.canvasEl) {
            this.canvasEl = this.template.querySelector('.visualizer');
            this.canvasCtx = this.canvasEl.getContext('2d');
            const rect = this.canvasEl.getBoundingClientRect();
            this.canvasEl.width = rect.width;
            this.canvasEl.height = 60;
        }
    }

    get playButtonClass() {
        return this.isPlaying ? 'playBtn playBtn--active' : 'playBtn';
    }

    setupAudioGraph() {
        if (this.audioCtx) {
            return;
        }
        this.audioCtx = new AudioContext();
        const source = this.audioCtx.createMediaElementSource(this.audioEl);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
    }

    handleToggle() {
        if (this.isPlaying) {
            this.audioEl.pause();
            this.isPlaying = false;
            cancelAnimationFrame(this.rafId);
        } else {
            this.setupAudioGraph();
            this.audioEl.play();
            this.isPlaying = true;
            this.drawLoop();
        }
    }

    handleSeek(event) {
        const ratio = event.target.value / 1000;
        if (this.audioEl.duration) {
            this.audioEl.currentTime = ratio * this.audioEl.duration;
        }
    }

    drawLoop() {
        this.rafId = requestAnimationFrame(() => this.drawLoop());
        const bufferLength = this.analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(data);

        const ctx = this.canvasCtx;
        const width = this.canvasEl.width;
        const height = this.canvasEl.height;
        const centerY = height / 2;
        ctx.clearRect(0, 0, width, height);

        const playedRatio = this.audioEl.duration
            ? this.audioEl.currentTime / this.audioEl.duration
            : 0;

        const barSlot = width / bufferLength;
        const barWidth = barSlot * 0.35;
        const minHalfHeight = height * 0.08;
        const edgeWidth = 0.04;

         for (let i = 0; i < bufferLength; i++) {
    const norm = data[i] / 255;
    const boosted = Math.sqrt(norm);
    const t = i / bufferLength;

    const edgeFade = Math.sin(t * Math.PI);
    const fadeAmount = 0.4 + 0.6 * edgeFade;

    const halfBarHeight = Math.max(boosted * (height / 2) * fadeAmount, minHalfHeight * fadeAmount);
    const x = i * barSlot + (barSlot - barWidth) / 2;

    const distance = playedRatio - t;
    const purpleAmount = Math.min(Math.max(distance / edgeWidth + 0.5, 0), 1);

    ctx.fillStyle = this.lerpColor(purpleAmount);
    ctx.fillRect(x, centerY - halfBarHeight, barWidth, halfBarHeight * 2);
}

    }

    lerpColor(t) {
        const start = { r: 61, g: 255, b: 207 };
        const end = { r: 216, g: 180, b: 254 };

        const r = Math.round(start.r + (end.r - start.r) * t);
        const g = Math.round(start.g + (end.g - start.g) * t);
        const b = Math.round(start.b + (end.b - start.b) * t);

        return `rgb(${r}, ${g}, ${b})`;
    }
}