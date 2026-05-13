// ── VEOMA Labs API Integration ──
const API_BASE = 'https://veoma-labs-backend.onrender.com';

// ── Full-screen 3D printing loader ──
function showLoader() {
    if (document.getElementById('_veomaLoader')) return;
    const el = document.createElement('div');
    el.id = '_veomaLoader';
    el.innerHTML = `
    <style>
        #_veomaLoader {
            position: fixed; inset: 0; z-index: 99999;
            background: rgba(0,3,8,0.92);
            backdrop-filter: blur(10px);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 28px;
            animation: _loaderFadeIn 0.3s ease;
        }
        @keyframes _loaderFadeIn { from { opacity:0 } to { opacity:1 } }
        #_veomaLoader .ld-stage {
            position: relative; width: 120px; height: 120px;
        }
        /* Print bed */
        #_veomaLoader .ld-bed {
            position: absolute; bottom: 0; left: 10px; right: 10px;
            height: 10px; background: rgba(0,169,189,0.25);
            border: 1px solid rgba(0,169,189,0.5); border-radius: 3px;
        }
        /* Layers stack */
        #_veomaLoader .ld-layers {
            position: absolute; bottom: 10px; left: 22px; right: 22px;
            display: flex; flex-direction: column-reverse; gap: 2px;
        }
        #_veomaLoader .ld-layer {
            height: 6px; border-radius: 2px;
            background: linear-gradient(90deg, #00a9bd, #008a9e);
            transform-origin: left;
            animation: _layerPrint 2.4s ease-in-out infinite;
        }
        #_veomaLoader .ld-layer:nth-child(1) { animation-delay: 0s;    opacity: 1;    width: 100%; }
        #_veomaLoader .ld-layer:nth-child(2) { animation-delay: 0.4s;  opacity: 0.8;  width: 88%; }
        #_veomaLoader .ld-layer:nth-child(3) { animation-delay: 0.8s;  opacity: 0.6;  width: 72%; }
        #_veomaLoader .ld-layer:nth-child(4) { animation-delay: 1.2s;  opacity: 0.4;  width: 55%; }
        #_veomaLoader .ld-layer:nth-child(5) { animation-delay: 1.6s;  opacity: 0.2;  width: 35%; }
        @keyframes _layerPrint {
            0%,100% { transform: scaleX(0); opacity: 0; }
            30%,70% { transform: scaleX(1); opacity: 1; }
        }
        /* Nozzle */
        #_veomaLoader .ld-nozzle {
            position: absolute; top: 0; left: 0;
            animation: _nozzleSweep 2.4s ease-in-out infinite;
        }
        @keyframes _nozzleSweep {
            0%,100% { transform: translateX(10px); }
            50%      { transform: translateX(80px); }
        }
        #_veomaLoader .ld-nozzle-body {
            width: 28px; height: 18px;
            background: linear-gradient(135deg, #e0e0e0, #a0a0a0);
            border-radius: 4px 4px 0 0;
        }
        #_veomaLoader .ld-nozzle-tip {
            width: 0; height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid #a0a0a0;
            margin: 0 auto;
        }
        #_veomaLoader .ld-filament {
            width: 2px; height: 14px;
            background: linear-gradient(to bottom, #00a9bd, transparent);
            margin: 0 auto;
            animation: _filamentPulse 0.6s ease-in-out infinite alternate;
        }
        @keyframes _filamentPulse {
            from { opacity: 1; transform: scaleY(1); }
            to   { opacity: 0.3; transform: scaleY(0.5); }
        }
        /* Glow ring */
        #_veomaLoader .ld-ring {
            position: absolute; inset: -8px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: #00a9bd;
            border-right-color: rgba(0,169,189,0.3);
            animation: _ringSpinOuter 1.8s linear infinite;
        }
        #_veomaLoader .ld-ring2 {
            position: absolute; inset: 4px;
            border-radius: 50%;
            border: 1px solid transparent;
            border-bottom-color: rgba(0,169,189,0.6);
            animation: _ringSpinInner 1.2s linear infinite reverse;
        }
        @keyframes _ringSpinOuter { to { transform: rotate(360deg); } }
        @keyframes _ringSpinInner { to { transform: rotate(360deg); } }
        #_veomaLoader .ld-text {
            color: #ffffff; font-size: 1rem; font-weight: 600;
            font-family: 'Inter', sans-serif; letter-spacing: 0.5px;
            animation: _textPulse 1.5s ease-in-out infinite;
        }
        #_veomaLoader .ld-sub {
            color: rgba(0,169,189,0.8); font-size: 0.78rem;
            font-family: 'Inter', sans-serif; letter-spacing: 2px;
            text-transform: uppercase;
        }
        @keyframes _textPulse {
            0%,100% { opacity: 1; } 50% { opacity: 0.5; }
        }
    </style>
    <div class="ld-stage">
        <div style="position:relative;width:60px;height:60px;margin:0 auto 12px;">
            <div class="ld-ring"></div>
            <div class="ld-ring2"></div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem;">🖨️</div>
        </div>
        <div class="ld-nozzle">
            <div class="ld-nozzle-body"></div>
            <div class="ld-nozzle-tip"></div>
            <div class="ld-filament"></div>
        </div>
        <div class="ld-bed"></div>
        <div class="ld-layers">
            <div class="ld-layer"></div>
            <div class="ld-layer"></div>
            <div class="ld-layer"></div>
            <div class="ld-layer"></div>
            <div class="ld-layer"></div>
        </div>
    </div>
    <div class="ld-text">Submitting your request</div>
    <div class="ld-sub">Layer by layer ···</div>`;
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
}

function hideLoader() {
    const el = document.getElementById('_veomaLoader');
    if (el) {
        el.style.animation = 'none';
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(() => { el.remove(); document.body.style.overflow = 'auto'; }, 300);
    }
}

// ── Helper: button disable during submit ──
function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
        btn.disabled = true;
        btn.dataset.original = btn.innerHTML;
        showLoader();
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.original;
        hideLoader();
    }
}

// ── Helper: show modern success popup ──
function showSuccess(message) {
    hideLoader();
    let popup = document.getElementById('_veomaSuccess');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = '_veomaSuccess';
        document.body.appendChild(popup);
    }
    popup.innerHTML = `
    <style>
        #_veomaSuccess {
            position: fixed; inset: 0; z-index: 99998;
            background: rgba(0,3,8,0.85);
            backdrop-filter: blur(12px);
            display: flex; align-items: center; justify-content: center;
            animation: _successFadeIn 0.35s cubic-bezier(0.23,1,0.32,1);
        }
        @keyframes _successFadeIn { from { opacity:0 } to { opacity:1 } }
        #_veomaSuccess .sp-card {
            background: linear-gradient(145deg, #0d1520, #060c18);
            border: 1px solid rgba(0,169,189,0.35);
            border-radius: 24px;
            padding: 48px 40px 40px;
            width: 90%; max-width: 420px;
            text-align: center;
            box-shadow: 0 0 60px rgba(0,169,189,0.2), 0 30px 60px rgba(0,0,0,0.5);
            animation: _cardPop 0.4s cubic-bezier(0.23,1,0.32,1);
            position: relative; overflow: hidden;
        }
        @keyframes _cardPop {
            from { opacity:0; transform: scale(0.88) translateY(20px); }
            to   { opacity:1; transform: scale(1) translateY(0); }
        }
        #_veomaSuccess .sp-card::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 2px;
            background: linear-gradient(90deg, transparent, #00a9bd, transparent);
        }
        #_veomaSuccess .sp-icon-wrap {
            width: 80px; height: 80px; border-radius: 50%;
            background: rgba(0,169,189,0.1);
            border: 2px solid rgba(0,169,189,0.4);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px;
            animation: _iconPulse 2s ease-in-out infinite;
        }
        @keyframes _iconPulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(0,169,189,0.3); }
            50%      { box-shadow: 0 0 0 12px rgba(0,169,189,0); }
        }
        #_veomaSuccess .sp-checkmark {
            width: 36px; height: 36px;
            stroke: #00a9bd; stroke-width: 3;
            stroke-linecap: round; stroke-linejoin: round;
            fill: none;
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: _drawCheck 0.6s 0.2s ease forwards;
        }
        @keyframes _drawCheck { to { stroke-dashoffset: 0; } }
        #_veomaSuccess .sp-title {
            color: #ffffff; font-size: 1.45rem; font-weight: 800;
            font-family: 'Inter', sans-serif; margin-bottom: 10px;
        }
        #_veomaSuccess .sp-msg {
            color: #8a9bb0; font-size: 0.92rem; line-height: 1.65;
            font-family: 'Inter', sans-serif; margin-bottom: 28px;
        }
        #_veomaSuccess .sp-badge {
            display: inline-block;
            background: rgba(0,169,189,0.1);
            border: 1px solid rgba(0,169,189,0.3);
            color: #00a9bd; font-size: 0.72rem; font-weight: 700;
            letter-spacing: 2px; text-transform: uppercase;
            padding: 5px 14px; border-radius: 20px; margin-bottom: 20px;
        }
        #_veomaSuccess .sp-btns {
            display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
        }
        #_veomaSuccess .sp-btn-primary {
            padding: 13px 28px;
            background: linear-gradient(135deg, #00a9bd, #008a9e);
            color: #fff; border: none; border-radius: 12px;
            font-size: 0.9rem; font-weight: 700;
            font-family: 'Inter', sans-serif;
            cursor: pointer; text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            display: inline-flex; align-items: center; gap: 6px;
        }
        #_veomaSuccess .sp-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,169,189,0.4);
        }
        #_veomaSuccess .sp-btn-secondary {
            padding: 13px 28px;
            background: rgba(255,255,255,0.06);
            color: #a0aec0; border: 1px solid rgba(255,255,255,0.12);
            border-radius: 12px; font-size: 0.9rem; font-weight: 600;
            font-family: 'Inter', sans-serif;
            cursor: pointer; transition: all 0.2s;
        }
        #_veomaSuccess .sp-btn-secondary:hover {
            background: rgba(255,255,255,0.1); color: #fff;
        }
    </style>
    <div class="sp-card">
        <div class="sp-badge">&#10003; Submitted</div>
        <div class="sp-icon-wrap">
            <svg class="sp-checkmark" viewBox="0 0 36 36">
                <polyline points="6,18 14,26 30,10"/>
            </svg>
        </div>
        <div class="sp-title">Successfully Submitted!</div>
        <div class="sp-msg">${message}<br><br>Our team will get back to you shortly.</div>
        <div class="sp-btns">
            <a href="contactus.html" class="sp-btn-primary">📞 Contact Us</a>
            <button class="sp-btn-secondary" onclick="closeSuccessPopup()">Close</button>
        </div>
    </div>`;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSuccessPopup() {
    const popup = document.getElementById('_veomaSuccess');
    if (popup) {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.25s';
        setTimeout(() => { popup.remove(); document.body.style.overflow = 'auto'; }, 250);
    }
}

// ── Helper: show error ──
function showError(message) {
    alert('❌ ' + message);
}

// ─────────────────────────────────────────
// 1. PRINTING FORM  →  POST /printer-product  (multipart/form-data)
// ─────────────────────────────────────────
async function submitPrintingForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');

    const fileInput = document.getElementById('fileInput');
    if (fileInput && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name.toLowerCase();
        if (!fileName.endsWith('.stl') && !fileName.endsWith('.obj')) {
            alert('Only STL or OBJ files are allowed.');
            return;
        }
    }

    const fd = new FormData();
    fd.append('full_name',       form.querySelector('[name="name"]')?.value?.trim() || '');
    fd.append('email',           form.querySelector('[name="email"]')?.value?.trim() || '');
    fd.append('whatsapp_number', form.querySelector('[name="mobile"]')?.value?.trim() || '');
    fd.append('project_details', form.querySelector('[name="comments"]')?.value?.trim() || '');
    fd.append('material',        form.querySelector('[name="material"]')?.value || '');
    const dimX = form.querySelector('[name="dimX"]')?.value;
    const dimY = form.querySelector('[name="dimY"]')?.value;
    const dimZ = form.querySelector('[name="dimZ"]')?.value;
    if (dimX) fd.append('length_x', dimX);
    if (dimY) fd.append('width_y',  dimY);
    if (dimZ) fd.append('height_z', dimZ);
    if (fileInput && fileInput.files[0]) fd.append('file', fileInput.files[0]);

    setLoading(btn, true);
    try {
        const res = await fetch(`${API_BASE}/printer-product`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(await res.text());
        closeServiceModal('printing');
        form.reset();
        const lbl = document.getElementById('fileLabel');
        if (lbl) lbl.textContent = 'Click to browse .STL or .OBJ file';
        showSuccess('Your printing request has been submitted! We will reach you soon.');
    } catch (err) {
        showError('Failed to submit. Please try again.');
        console.error(err);
    } finally {
        setLoading(btn, false);
    }
}

// ─────────────────────────────────────────
// 2. SCANNING FORM  →  POST /scanning  (multipart/form-data)
// ─────────────────────────────────────────
async function submitScanningForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');

    const fd = new FormData();
    fd.append('full_name',       form.querySelector('[name="name"]')?.value?.trim() || '');
    fd.append('email',           form.querySelector('[name="email"]')?.value?.trim() || '');
    fd.append('whatsapp_number', form.querySelector('[name="mobile"]')?.value?.trim() || '');
    fd.append('project_details', form.querySelector('[name="comments"]')?.value?.trim() || '');
    const scanInput = document.getElementById('scanFileInput');
    if (scanInput) Array.from(scanInput.files).forEach(f => fd.append('images', f));

    setLoading(btn, true);
    try {
        const res = await fetch(`${API_BASE}/scanning`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(await res.text());
        closeServiceModal('scanning');
        form.reset();
        const lbl = document.getElementById('scanFileLabel');
        if (lbl) lbl.textContent = 'Click to browse images (min 4-5)';
        showSuccess('Your scanning request has been submitted! We will reach you soon.');
    } catch (err) {
        showError('Failed to submit. Please try again.');
        console.error(err);
    } finally {
        setLoading(btn, false);
    }
}

// ─────────────────────────────────────────
// 3. DESIGNING FORM  →  POST /designing  (multipart/form-data)
// ─────────────────────────────────────────
async function submitDesigningForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');

    const fd = new FormData();
    fd.append('full_name',       form.querySelector('[name="name"]')?.value?.trim() || '');
    fd.append('email',           form.querySelector('[name="email"]')?.value?.trim() || '');
    fd.append('whatsapp_number', form.querySelector('[name="mobile"]')?.value?.trim() || '');
    fd.append('project_details', form.querySelector('[name="comments"]')?.value?.trim() || '');
    const designInput = document.getElementById('designFileInput');
    if (designInput) Array.from(designInput.files).forEach(f => fd.append('images', f));

    setLoading(btn, true);
    try {
        const res = await fetch(`${API_BASE}/designing`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(await res.text());
        closeServiceModal('designing');
        form.reset();
        const lbl = document.getElementById('designFileLabel');
        if (lbl) lbl.textContent = 'Click to browse product images (min 4-5)';
        showSuccess('Your designing request has been submitted! We will reach you soon.');
    } catch (err) {
        showError('Failed to submit. Please try again.');
        console.error(err);
    } finally {
        setLoading(btn, false);
    }
}

// ─────────────────────────────────────────
// 4. FEEDBACK FORM  →  POST /feedback
// ─────────────────────────────────────────
async function submitFeedbackAPI(name, profession, message, rating) {
    const payload = { name, profession, message, rating: parseInt(rating) };
    const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

// ─────────────────────────────────────────
// 5. CONTACT FORM  →  POST /contact
// ─────────────────────────────────────────
async function submitContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('.submit-btn');

    const payload = {
        full_name:     form.querySelector('#name')?.value?.trim(),
        email:         form.querySelector('#email')?.value?.trim() || null,
        mobile_number: form.querySelector('#mobile')?.value?.trim() || null,
        location:      form.querySelector('#location')?.value?.trim() || null,
        user_message:  form.querySelector('#message')?.value?.trim() || null
    };

    setLoading(btn, true);
    try {
        const res = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(await res.text());
        form.reset();
        showSuccess('Your message has been sent! We will reach you soon.');
    } catch (err) {
        showError('Failed to send message. Please try again.');
        console.error(err);
    } finally {
        setLoading(btn, false);
    }
}

// ─────────────────────────────────────────
// 6. WORKSHOP FORM  →  POST /workshop
// ─────────────────────────────────────────
async function submitWorkshopForm(form, workshopName, workshopType) {
    const btn = form.querySelector('.premium-submit-btn');

    const payload = {
        full_name:     form.querySelector('[name="fullname"]')?.value?.trim(),
        email:         form.querySelector('[name="email"]')?.value?.trim() || null,
        mobile_number: form.querySelector('[name="mobile"]')?.value?.trim() || null,
        qualification: form.querySelector('[name="qualification"]')?.value?.trim() || null,
        workshop_name: workshopName,
        workshop_type: workshopType
    };

    setLoading(btn, true);
    try {
        const res = await fetch(`${API_BASE}/workshop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    } catch (err) {
        showError('Failed to register. Please try again.');
        console.error(err);
        return false;
    } finally {
        setLoading(btn, false);
    }
}
