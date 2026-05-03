#!/usr/bin/env python3
# Generates a static HTML file for each project in projects.js
# Run with: python3 build.py
# Output: reina-fruktgard.html, stoppestedet.html, etc.

import re, json, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Parse projects.js ────────────────────────────────────────────────────────

def js_to_json(src):
    """Convert JS object literal syntax to valid JSON."""
    result = []
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        # String literal
        if c in ('"', "'"):
            quote = c
            result.append('"')
            i += 1
            while i < n:
                c = src[i]
                if c == '\\':
                    if i + 1 < n:
                        next_c = src[i + 1]
                        result.append('\\')
                        result.append(next_c)
                        i += 2
                    else:
                        i += 1
                elif c == quote:
                    result.append('"')
                    i += 1
                    break
                elif c == '"' and quote == "'":
                    result.append('\\"')
                    i += 1
                else:
                    result.append(c)
                    i += 1
        # Identifier — may be an object key or a value (true/false/null)
        elif c.isalpha() or c == '_':
            j = i
            while j < n and (src[j].isalnum() or src[j] == '_'):
                j += 1
            word = src[i:j]
            # Peek ahead past whitespace to see if next non-space char is ':'
            k = j
            while k < n and src[k] in ' \t':
                k += 1
            if k < n and src[k] == ':' and (k + 1 >= n or src[k + 1] != ':'):
                result.append(f'"{word}"')  # quote the key
            else:
                result.append(word)  # leave true/false/null as-is
            i = j
        else:
            result.append(c)
            i += 1
    text = ''.join(result)
    # Remove trailing commas
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return text


def load_projects():
    with open(os.path.join(SCRIPT_DIR, "projects.js"), encoding="utf-8") as f:
        src = f.read()

    # Remove assignment wrapper
    src = re.sub(r"^window\.PROJECTS\s*=\s*", "", src.strip()).rstrip(";")

    return json.loads(js_to_json(src))


PROJECTS = load_projects()

# ── HTML helpers ─────────────────────────────────────────────────────────────

def esc_q(s):
    return str(s or "").replace('"', "&quot;")

def render_figure(item, i, project_title):
    if isinstance(item, str):
        src, caption, wide, crop, crop_scale, is_video, autoplay, crop_x, link, caption_link, eager, grow = (
            item, None, False, False, None, False, False, None, None, None, False, None)
    else:
        src = item.get("src", "")
        caption = item.get("caption")
        wide = item.get("wide", False)
        crop = item.get("crop", False)
        crop_scale = item.get("cropScale")
        is_video = item.get("video", False)
        autoplay = item.get("autoplay", False)
        crop_x = item.get("cropX")
        link = item.get("link")
        caption_link = item.get("captionLink")
        eager = item.get("eager", False)
        grow = item.get("grow")

    classes = " ".join(filter(None, [
        "project__figure",
        "project__figure--wide" if wide else None,
        "project__figure--crop" if crop else None,
        "project__figure--cropx" if crop_x else None,
    ]))

    if is_video:
        if autoplay:
            media = f'<video class="project__video" src="{src}" autoplay muted loop playsinline></video>'
        else:
            media = f'<video class="project__video" src="{src}" controls playsinline preload="metadata"></video>'
    else:
        loading = "eager" if eager else "lazy"
        media = f'<img loading="{loading}" decoding="async" src="{src}" alt="{esc_q(project_title)} — galleri {i + 1}">'

    fig_style_parts = []
    if crop_scale:
        fig_style_parts.append(f"--crop-scale:{crop_scale}")
    elif crop_x and crop_x is not True:
        fig_style_parts.append(f"--crop-scale:{crop_x}")
    if grow:
        fig_style_parts.append(f"flex:{grow}")
    fig_style = ";".join(fig_style_parts)
    style_attr = f' style="{fig_style}"' if fig_style else ""

    caption_html = ""
    if caption:
        cl = f' <a href="{caption_link}" target="_blank" rel="noopener" class="project__figcaption-link">Se nettside →</a>' if caption_link else ""
        caption_html = f'<figcaption class="project__figcaption">{caption}{cl}</figcaption>'

    figure = f'<figure class="{classes}"{style_attr}>\n          {media}\n          {caption_html}\n        </figure>'
    if link:
        return f'<a href="{link}" target="_blank" rel="noopener" class="project__figure-link">{figure}</a>'
    return figure


def render_accordion(project):
    parts = []
    for s in project.get("background", []):
        heading = s.get("heading", "")
        body_html = "".join(f'<p class="bg__body">{p}</p>' for p in s["body"].split("\n\n")) if s.get("body") else ""
        inner = f'<div class="bg__body-cols">{body_html}</div>' if s.get("twoCols") else body_html

        if s.get("image"):
            inner += f'<img class="bg__img" src="{s["image"]}" alt="{esc_q(heading)}" loading="lazy" decoding="async">'
        if s.get("body2"):
            inner += "".join(f'<p class="bg__body">{p}</p>' for p in s["body2"].split("\n\n"))
        if s.get("image2"):
            inner += f'<img class="bg__img" src="{s["image2"]}" alt="{esc_q(heading)}" loading="lazy" decoding="async">'
        if s.get("body3"):
            inner += "".join(f'<p class="bg__body">{p}</p>' for p in s["body3"].split("\n\n"))
        if s.get("images"):
            imgs = "".join(f'<img class="bg__img bg__img--small" src="{src}" alt="{esc_q(heading)}" loading="lazy" decoding="async">' for src in s["images"])
            inner += f'<div class="bg__img-row">{imgs}</div>'

        if s.get("palette"):
            is_cards = any(c.get("description") for c in s["palette"])
            if is_cards:
                items = "".join(f'''
              <div class="palette__item">
                <div class="palette__swatch" style="background:{c["hex"]}"></div>
                <div class="palette__info">
                  <span class="palette__name">{c["name"]}</span>
                  <span class="palette__hex">{c["hex"]}</span>
                  <span class="palette__desc">{c.get("description","")}</span>
                </div>
              </div>''' for c in s["palette"])
                inner += f'<div class="palette palette--cards">{items}</div>'
            else:
                items = "".join(f'''
              <div class="palette__item">
                <div class="palette__swatch" style="background:{c["hex"]}"></div>
                <div class="palette__info">
                  <span class="palette__hex">{c["hex"]}</span>
                  <span class="palette__name">{c["name"]}</span>
                  <span class="palette__val">RGB\u00a0\u00a0{c.get("rgb","")}</span>
                  <span class="palette__val">CMYK\u00a0{c.get("cmyk","")}</span>
                  <span class="palette__val">{c.get("pantone","")}</span>
                </div>
              </div>''' for c in s["palette"])
                inner += f'<div class="palette">{items}</div>'

        if s.get("imageSmall"):
            inner += f'<img class="bg__img bg__img--sm" src="{s["imageSmall"]}" alt="{esc_q(heading)}" loading="lazy" decoding="async">'
        if s.get("imageStack"):
            imgs = "".join(f'<img class="bg__img bg__img--stacked" src="{src}" alt="{esc_q(heading)}" loading="lazy" decoding="async">' for src in s["imageStack"])
            inner += f'<div class="bg__img-stack">{imgs}</div>'
        if s.get("imagePairs"):
            pairs = "".join(f'<div class="bg__img-pair"><img class="bg__img" src="{l}" loading="lazy" decoding="async"><img class="bg__img" src="{r}" loading="lazy" decoding="async"></div>' for l, r in s["imagePairs"])
            inner += f'<div class="bg__img-pairs">{pairs}</div>'

        if s.get("links"):
            for lnk in s["links"]:
                if lnk.get("plain"):
                    inner += f'<a class="accordion__link" href="{lnk["src"]}" target="_blank" rel="noopener">↗ {lnk["label"]}</a>'
                else:
                    inner += f'<a class="btn-pdf btn-pdf--green" href="{lnk["src"]}" target="_blank" rel="noopener" style="margin-top:12px;display:inline-block">↗ {lnk["label"]}</a>'
        if s.get("link"):
            lnk = s["link"]
            if lnk.get("plain"):
                inner += f'<a class="accordion__link" href="{lnk["src"]}" target="_blank" rel="noopener">↗ {lnk["label"]}</a>'
            else:
                inner += f'<a class="btn-pdf btn-pdf--green" href="{lnk["src"]}" target="_blank" rel="noopener" style="margin-top:18px;display:inline-block">↗ {lnk["label"]}</a>'

        parts.append(f'''
          <div class="accordion__item">
            <button class="accordion__trigger" type="button" aria-expanded="false">
              <span class="accordion__title">{heading}</span>
              <span class="accordion__icon"></span>
            </button>
            <div class="accordion__panel">
              <div class="accordion__panel-inner">{inner}</div>
            </div>
          </div>''')
    return "".join(parts)


def render_slideshow(project):
    all_slides = [{"src": project["cover"], "caption": project.get("coverCaption")}]
    for img in project.get("images", []):
        if isinstance(img, str):
            all_slides.append({"src": img, "caption": None})
        else:
            all_slides.append(img)

    slides_html = ""
    for i, slide in enumerate(all_slides):
        cap = esc_q(slide.get("caption") or "")
        loading = "eager" if i == 0 else "lazy"
        slides_html += f'''
              <figure class="slideshow__slide" data-caption="{cap}">
                <img loading="{loading}" decoding="async" src="{slide["src"]}" alt="{esc_q(project["title"])} — bilde {i + 1}">
              </figure>'''

    first_caption = all_slides[0].get("caption") or ""
    return f'''
        <div class="slideshow__caption-bar" id="slideshowCaption">{first_caption}</div>
        <div class="slideshow" id="slideshow">
          <div class="slideshow__track" id="slideshowTrack">{slides_html}
          </div>
          <button class="slideshow__btn slideshow__btn--prev" id="slidePrev" aria-label="Forrige bilde"><svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true"><path d="M8 1L1 8L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="slideshow__btn slideshow__btn--next" id="slideNext" aria-label="Neste bilde"><svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true"><path d="M1 1L8 8L1 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div class="slideshow__counter"><span id="slideIndex">1</span> / {len(all_slides)}</div>
        </div>'''


def render_gallery(project):
    gallery = project.get("gallery", [])
    if not gallery:
        return ""
    parts = []
    for i, item in enumerate(gallery):
        if item and item.get("type") == "heading":
            parts.append(f'<div class="project__gallery-heading">{item["text"]}</div>')
        elif item and item.get("type") == "expandable":
            cover_fig = render_figure(item["cover"], i, project["title"])
            rest_figs = "".join(render_figure(sub, i + j + 1, project["title"]) for j, sub in enumerate(item["items"]))
            parts.append(f'''<div class="gallery-expandable">
                <div class="gallery-expandable__heading">{item["heading"]}</div>
                <div class="gallery-expandable__strip">
                  <div class="gallery-expandable__cover">{cover_fig}</div>
                  <div class="gallery-expandable__rest">{rest_figs}</div>
                </div>
                <button class="gallery-expandable__close-btn" aria-label="Lukk">↑ Lukk</button>
              </div>''')
        elif item and item.get("type") == "row":
            row_figs = "".join(render_figure(sub, i + j, project["title"]) for j, sub in enumerate(item["items"]))
            parts.append(f'<div class="project__gallery-row">{row_figs}</div>')
        elif item and item.get("type") == "palette":
            color_items = "".join(f'''
              <div class="palette__item">
                <div class="palette__swatch" style="background:{c["color"]}"></div>
                <div class="palette__info">
                  <span class="palette__name">{c["name"]}</span>
                  <span class="palette__hex">{c["hex"]}</span>
                  {f'<span class="palette__desc">{c["description"]}</span>' if c.get("description") else ""}
                </div>
              </div>''' for c in item["colors"])
            parts.append(f'<div class="palette palette--cards" style="column-span:all;margin-bottom:clamp(20px,3vw,36px)">{color_items}</div>')
        else:
            parts.append(render_figure(item, i, project["title"]))
    return f'\n        <div class="project__gallery">\n          {"".join(parts)}\n        </div>'


def render_sections(project):
    sections = project.get("sections", [])
    if not sections:
        return ""
    parts = []
    for s in sections:
        label = f'<p class="proj-section__label">{s["label"]}</p>' if s.get("label") else ""
        heading = f'<h2 class="proj-section__heading">{s["heading"]}</h2>' if s.get("heading") else ""
        body = f'<p class="proj-section__body">{s["body"]}</p>' if s.get("body") else ""
        bg = s.get("bg", "krem")
        t = s.get("type", "")

        if t == "problem":
            prob_img = f'<img class="proj-problem__img" src="{s["image"]}" alt="{esc_q(s.get("label",""))}" loading="lazy" decoding="async">' if s.get("image") else ""
            items_label = f'<p class="proj-problem-list__label">{s["itemsLabel"]}</p>' if s.get("itemsLabel") else ""
            items_html = "".join(f'<div class="proj-problem-item"><div class="proj-problem-dot"></div><div><h4>{it["title"]}</h4><p>{it["body"]}</p></div></div>' for it in s.get("items", []))
            img_wrap = f"<div>{prob_img}</div>" if prob_img else ""
            parts.append(f'<div class="proj-section proj-section--{bg}"><div>{label}{heading}{body}</div><div class="proj-problem proj-problem--below">{img_wrap}<div class="proj-problem-list">{items_label}{items_html}</div></div></div>')
        elif t == "steps":
            steps_html = "".join(f'<div class="proj-step"><div class="proj-step-num">{st["num"]}</div><h3>{st["title"]}</h3><p>{st["body"]}</p></div>' for st in s.get("steps", []))
            parts.append(f'<div class="proj-section proj-section--{bg}">{label}{heading}<div class="proj-steps-grid">{steps_html}</div></div>')
        elif t == "features":
            feats_html = "".join(f'<div class="proj-feature"><span class="proj-feature-num">{it["num"]}</span><div><h3>{it["title"]}</h3><p>{it["body"]}</p></div></div>' for it in s.get("items", []))
            parts.append(f'<div class="proj-section proj-section--{bg}">{label}{heading}{body}<div class="proj-features-grid">{feats_html}</div></div>')
        elif t == "team":
            members_html = "".join(f'<div class="proj-team-card"><div class="proj-team-avatar" style="background:{m["color"]}">{m["initials"]}</div><h4>{m["name"]}</h4><p>{m["role"]}</p></div>' for m in s.get("members", []))
            parts.append(f'<div class="proj-section proj-section--{bg}"><div class="proj-team-header">{label}{heading}</div><div class="proj-team-grid">{members_html}</div></div>')
    return f'<div class="proj-sections">{"".join(parts)}</div>'


def render_scroll_galleries(project):
    parts = []
    for g in project.get("scrollGalleries", []):
        label_html = f'<p class="scroll-gallery__label">{g["label"]}</p>' if g.get("label") else ""
        size = g.get("size", "")
        extra_class = " scroll-gallery__img--ipad" if size == "ipad" else (" scroll-gallery__img--mobile" if size == "mobile" else "")
        imgs = "".join(f'<img class="scroll-gallery__img{extra_class}" src="{src}" alt="{esc_q(project["title"])}" loading="lazy" decoding="async">' for src in g["images"])
        parts.append(f'''
          <div class="scroll-gallery">
            {label_html}
            <p class="scroll-gallery__swipe-hint" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Sveip</p>
            <div class="scroll-gallery__track">{imgs}</div>
          </div>''')
    return "".join(parts)


def render_related(project):
    others = [p for p in PROJECTS if p["id"] != project["id"]][:3]
    if not others:
        return ""
    cards = "".join(f'''
                <a class="related__card" href="./{p["id"]}.html">
                  <img src="{p["cover"]}" alt="{esc_q(p["title"])}" loading="lazy">
                  <p class="related__title">{p["title"]}</p>
                </a>''' for p in others)
    return f'<div class="related"><h2 class="related__heading">Mer å se på</h2><div class="related__grid">{cards}</div></div>'


def render_project_content(project):
    accordion_html = render_accordion(project)
    meta_rows = "".join(f'''
        <div class="pmeta__row">
          <strong class="pmeta__label">{row["label"]}</strong>
          <span class="pmeta__value">{row["value"]}</span>
        </div>''' for row in project.get("projectMeta", []))

    has_gallery = bool(project.get("gallery"))
    has_sections = bool(project.get("sections"))
    show_accordion = project.get("showAccordion", False)

    # Media area
    if project.get("heroVideo"):
        collage = project.get("heroCollage")
        vid_content = f'<a href="{project["videoLink"]}" target="_blank" rel="noopener" style="display:block"><video src="{project["heroVideo"]}" autoplay muted loop playsinline></video></a>' if project.get("videoLink") else f'<video src="{project["heroVideo"]}" autoplay muted loop playsinline></video>'
        if collage:
            collage_imgs = "".join(f'<img src="{src}" alt="Designsystem" loading="lazy">' for src in collage["images"])
            collage_html = f'''
              <div class="hero-collage-wrap">
                <a class="hero-collage" href="{collage["src"]}" target="_blank" rel="noopener">{collage_imgs}</a>
                <a class="hero-collage__label" href="{collage["src"]}" target="_blank" rel="noopener">{collage["label"]}</a>
              </div>'''
            media_html = f'<div class="hero-media-row"><div class="hero-video">{vid_content}</div>{collage_html}</div>'
        else:
            media_html = f'<div class="hero-video">{vid_content}</div>'
    elif not project.get("noSlideshow"):
        media_html = render_slideshow(project)
    else:
        media_html = ""

    # Intro
    intro_html = ""
    if project.get("intro"):
        border_class = " project-intro--border" if project.get("introBorder") else ""
        intro_html = "".join(
            f'<p class="project-intro{border_class}">{p.replace(chr(10), "<br><span class=\"intro-space\"> </span>")}</p>'
            for p in project["intro"].split("\n\n")
        )

    intro_cols_html = ""
    if project.get("introColumns"):
        cols = "".join(f'<div class="intro-col"><strong class="intro-col__label">{c["label"]}</strong><p class="intro-col__body">{c["body"]}</p></div>' for c in project["introColumns"])
        intro_cols_html = f'<div class="intro-cols">{cols}</div>'

    # Header buttons
    link_btn = f'<a class="btn-pdf btn-pdf--black" href="{project["link"]["src"]}" target="_blank" rel="noopener">↗ {project["link"]["label"]}</a>' if project.get("link") else ""
    panel_btn_header = '<button class="panel-toggle panel-toggle--header" id="panelToggle" aria-expanded="false">Nøkkelpunkter <span class="panel-toggle__icon">+</span></button>' if (accordion_html and (not has_sections or show_accordion)) else ""

    # Meta area (shown when no gallery)
    process_btn = '<button class="btn-pdf btn-pdf--grey" id="processToggle" type="button" style="margin-top:16px;">Mer om prosessen</button>' if project.get("processText") else ""
    final_pdf_btn = f'<a class="btn-pdf btn-pdf--green" href="{project["finalPdf"]["src"]}" target="_blank" rel="noopener" style="margin-top:28px;display:inline-block">↗ {project["finalPdf"]["label"]}</a>' if project.get("finalPdf") else ""
    panel_btn_below = '<button class="panel-toggle panel-toggle--below" aria-expanded="false">Nøkkelpunkter <span class="panel-toggle__icon">+</span></button>' if (accordion_html and (not has_sections or show_accordion)) else ""

    meta_area = ""
    if not has_gallery:
        meta_area = f'''<div class="project-meta">
              {f'<div class="pmeta">{meta_rows}</div>' if meta_rows else ""}
              {process_btn}
              {final_pdf_btn}
              {panel_btn_below}
            </div>'''

    # Side panel
    side_panel = ""
    if accordion_html and (not has_sections or show_accordion):
        final_pdf_mobile = f'<a class="btn-pdf btn-pdf--green btn-pdf--mobile-only" href="{project["finalPdf"]["src"]}" target="_blank" rel="noopener" style="margin-top:24px;display:inline-block">↗ {project["finalPdf"]["label"]}</a>' if project.get("finalPdf") else ""
        pdf = project.get("pdf")
        if pdf and pdf.get("note"):
            pdf_section = f'''
                <div class="pdf-note" style="margin-top:16px">
                  <strong class="pdf-note__heading">{pdf["note"]["heading"]}</strong>
                  <p class="pdf-note__body">{pdf["note"]["body"]}</p>
                  <a class="btn-pdf btn-pdf--text" href="{pdf["src"]}" target="_blank" rel="noopener">↗ {pdf["label"]}</a>
                </div>'''
        elif pdf:
            pdf_section = f'<a class="btn-pdf btn-pdf--text" href="{pdf["src"]}" target="_blank" rel="noopener">↗ {pdf["label"]}</a>'
        else:
            pdf_section = ""
        side_panel = f'''
          <div class="project-layout__side">
            <div class="project-layout__info" id="projectInfo">
              <div class="project-layout__info-inner">
                <div class="accordion" id="accordion">{accordion_html}</div>
                {final_pdf_mobile}
                {pdf_section}
              </div>
            </div>
          </div>'''

    # Gallery meta
    gallery_meta = ""
    if has_gallery:
        gallery_meta = f'''<div class="project-meta" style="margin-top:var(--gap)">
          {f'<div class="pmeta">{meta_rows}</div>' if meta_rows else ""}
          {process_btn}
          {final_pdf_btn}
        </div>'''

    # Inline accordion (for projects with sections but no showAccordion)
    inline_accordion = ""
    if accordion_html and has_sections and not show_accordion:
        inline_accordion = f'''
        <button class="panel-toggle panel-toggle--bottom" aria-expanded="false">Nøkkelpunkter <span class="panel-toggle__icon">+</span></button>
        <div class="inline-accordion" id="inlineAccordion" hidden>
          <div class="accordion" id="accordion">{accordion_html}</div>
        </div>'''

    return f"""
        <div class="project-layout">
          <div class="project-layout__media">
            <div class="project-header">
              <h1 class="project-meta__title">{project["title"]}</h1>
              {intro_html}
              {intro_cols_html}
              <div class="header-btns">
                {link_btn}
                {panel_btn_header}
              </div>
            </div>
            {media_html}
            {meta_area}
          </div>{side_panel}
        </div>
        {render_gallery(project)}
        {gallery_meta}
        {render_scroll_galleries(project)}
        {render_sections(project)}
        {inline_accordion}
        {render_related(project)}
      """


# ── Full page template ────────────────────────────────────────────────────────

def render_page(project):
    description = ""
    if project.get("intro"):
        description = re.sub(r"<[^>]+>", "", project["intro"]).replace("\n", " ").strip()[:160]
    else:
        description = f'{project["title"]} — DesignbyJosefine'

    project_html = render_project_content(project)
    pid = project["id"]

    # The inline JS (interactive features only — content is already in the DOM)
    # We include projects.js + the same interaction code from project.html,
    # but skip the initial innerHTML render since the static HTML is already there.
    js = r"""
    const $ = (s) => document.querySelector(s);
    const id = """ + json.dumps(pid) + r""";

    const project = (window.PROJECTS || []).find(p => p.id === id);
    const yearEl = document.querySelector("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Slideshow
    const track = $("#slideshowTrack");
    if (track) {
      const slides = [...track.querySelectorAll(".slideshow__slide")];
      const counter = $("#slideIndex");
      let current = 0;
      let timer;
      const slideshow = $("#slideshow");
      const captionBar = $("#slideshowCaption");
      let paused = false;
      function goTo(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent = current + 1;
        if (captionBar) captionBar.textContent = slides[current].dataset.caption || "";
      }
      function startAuto() {
        clearInterval(timer);
        if (!paused) timer = setInterval(() => goTo(current + 1), 3500);
      }
      track.addEventListener("click", () => {
        paused = !paused;
        slideshow.classList.toggle("slideshow--paused", paused);
        if (paused) clearInterval(timer);
        else startAuto();
      });
      $("#slideNext")?.addEventListener("click", e => { e.stopPropagation(); goTo(current + 1); startAuto(); });
      $("#slidePrev")?.addEventListener("click", e => { e.stopPropagation(); goTo(current - 1); startAuto(); });
      let touchStartX = 0;
      track.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
      }, { passive: true });
      document.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") { goTo(current + 1); startAuto(); }
        if (e.key === "ArrowLeft")  { goTo(current - 1); startAuto(); }
      });
      startAuto();
    }

    // Accordion
    const accordion = document.getElementById("accordion");
    const accordionItems = [...(accordion?.querySelectorAll(".accordion__item") || [])];
    if (accordion) {
      accordion.querySelectorAll(".accordion__item").forEach(item => {
        item.querySelector(".accordion__trigger").addEventListener("click", () => {
          if (project && project.noDrawer) {
            const isOpen = item.classList.contains("accordion__item--open");
            accordion.querySelectorAll(".accordion__item").forEach(i => {
              i.classList.remove("accordion__item--open");
              i.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
              item.classList.add("accordion__item--open");
              item.querySelector(".accordion__trigger").setAttribute("aria-expanded", "true");
            }
          } else {
            const idx = accordionItems.indexOf(item);
            openDrawer();
            const panel = document.getElementById(`drawer-item-${idx}`)?.querySelector(".drawer-index__panel");
            const btn = document.getElementById(`drawer-item-${idx}`)?.querySelector(".drawer-index__btn");
            if (panel) { panel.hidden = false; btn.querySelector(".drawer-index__icon").textContent = "−"; }
          }
        });
      });
    }

    // Panel toggle
    const projectLayout = document.querySelector(".project-layout");
    const inlineAccordion = document.getElementById("inlineAccordion");
    function syncToggles(isOpen) {
      document.querySelectorAll(".panel-toggle").forEach(btn => {
        btn.setAttribute("aria-expanded", String(isOpen));
        btn.querySelector(".panel-toggle__icon").textContent = isOpen ? "−" : "+";
      });
    }
    document.querySelectorAll(".panel-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        let isOpen;
        if (inlineAccordion) {
          isOpen = inlineAccordion.hidden;
          inlineAccordion.hidden = !isOpen;
        } else {
          isOpen = projectLayout.classList.toggle("project-layout--panel-open");
        }
        syncToggles(isOpen);
      });
    });

    // Expandable gallery
    document.querySelectorAll(".gallery-expandable__cover").forEach(cover => {
      cover.addEventListener("click", () => {
        const section = cover.closest(".gallery-expandable");
        const wasOpen = section.classList.contains("is-open");
        section.classList.toggle("is-open");
        if (!wasOpen && window.innerWidth <= 780) {
          setTimeout(() => section.querySelector(".gallery-expandable__heading").scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
      });
    });
    document.querySelectorAll(".gallery-expandable__close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const section = btn.closest(".gallery-expandable");
        section.classList.remove("is-open");
        section.querySelector(".gallery-expandable__heading").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Lightbox
    const lbOverlay = document.getElementById("lbOverlay");
    const lbImg = document.getElementById("lbImg");
    const lbPrev = document.getElementById("lbPrev");
    const lbNext = document.getElementById("lbNext");
    let lbImages = [], lbIndex = 0;
    function openLightbox(src, alt, images, index) {
      lbImg.src = src; lbImg.alt = alt || "";
      lbImages = images || []; lbIndex = index ?? 0;
      lbPrev.style.display = lbImages.length > 1 ? "" : "none";
      lbNext.style.display = lbImages.length > 1 ? "" : "none";
      lbOverlay.classList.add("lb-open");
    }
    function closeLightbox() { lbOverlay.classList.remove("lb-open"); lbImg.src = ""; }
    function showLbImage(idx) {
      lbIndex = (idx + lbImages.length) % lbImages.length;
      lbImg.src = lbImages[lbIndex].src; lbImg.alt = lbImages[lbIndex].alt || "";
    }
    lbPrev.addEventListener("click", e => { e.stopPropagation(); showLbImage(lbIndex - 1); });
    lbNext.addEventListener("click", e => { e.stopPropagation(); showLbImage(lbIndex + 1); });
    document.addEventListener("click", e => {
      const imgEl = e.target.tagName === "IMG" && (e.target.classList.contains("bg__img") || e.target.closest(".project__figure")) ? e.target : null;
      if (imgEl) {
        const section = imgEl.closest(".gallery-expandable");
        if (section) {
          const imgs = [...section.querySelectorAll(".project__figure img")];
          openLightbox(imgEl.src, imgEl.alt, imgs.map(i => ({ src: i.src, alt: i.alt })), imgs.indexOf(imgEl));
        } else { openLightbox(imgEl.src, imgEl.alt, [], 0); }
      } else if (e.target === lbOverlay || e.target.id === "lbClose") { closeLightbox(); }
    });
    document.addEventListener("keydown", e => {
      if (!lbOverlay.classList.contains("lb-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLbImage(lbIndex - 1);
      if (e.key === "ArrowRight") showLbImage(lbIndex + 1);
    });

    // Process drawer
    const processToggle = document.getElementById("processToggle");
    const processDrawer = document.getElementById("processDrawer");
    const processBackdrop = document.getElementById("processBackdrop");
    const processDrawerClose = document.getElementById("processDrawerClose");
    const processDrawerContent = document.getElementById("processDrawerContent");

    const allSections = accordionItems.map(item => ({
      title: item.querySelector(".accordion__title").textContent,
      content: item.querySelector(".accordion__panel-inner").innerHTML
    }));
    if (project && project.processText) {
      allSections.push({ title: "Mer om prosessen", content: project.processText.split("\n\n").map(p => `<p>${p}</p>`).join("") });
    }
    function showDrawerIndex() {
      processDrawerContent.innerHTML = `<ul class="drawer-index">${allSections.map((s, i) => `<li class="drawer-index__item" id="drawer-item-${i}"><button class="drawer-index__btn" data-index="${i}"><span>${s.title}</span><span class="drawer-index__icon">+</span></button><div class="drawer-index__panel" hidden>${s.content}</div></li>`).join("")}</ul>`;
      processDrawerContent.querySelectorAll(".drawer-index__btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = btn.dataset.index;
          const panel = document.getElementById(`drawer-item-${i}`).querySelector(".drawer-index__panel");
          const isOpen = !panel.hidden;
          processDrawerContent.querySelectorAll(".drawer-index__panel").forEach(p => p.hidden = true);
          processDrawerContent.querySelectorAll(".drawer-index__icon").forEach(ic => ic.textContent = "+");
          if (!isOpen) { panel.hidden = false; btn.querySelector(".drawer-index__icon").textContent = "−"; }
        });
      });
    }
    function openDrawer() {
      if (allSections.length === 1) {
        processDrawerContent.innerHTML = `<h2 class="process-drawer__heading">${allSections[0].title}</h2>${allSections[0].content}`;
      } else { showDrawerIndex(); }
      processDrawer.classList.add("process-drawer--open");
      processBackdrop.classList.add("process-drawer__backdrop--visible");
      processDrawer.setAttribute("aria-hidden", "false");
    }
    function closeDrawer() {
      processDrawer.classList.remove("process-drawer--open");
      processBackdrop.classList.remove("process-drawer__backdrop--visible");
      processDrawer.setAttribute("aria-hidden", "true");
    }
    processToggle?.addEventListener("click", openDrawer);
    if (project && !project.noDrawer) {
      document.querySelectorAll(".panel-toggle").forEach(btn => btn.addEventListener("click", openDrawer));
    }
    processDrawerClose?.addEventListener("click", closeDrawer);
    processBackdrop?.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

    // Sidebar toggle
    const toggle = $("#sidebarToggle");
    toggle?.addEventListener("click", () => {
      const sidebar = $("#sidebar");
      const isOpen = sidebar.classList.toggle("sidebar--open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    """

    return f"""<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="format-detection" content="telephone=no">
  <title>{project["title"]} — DesignbyJosefine</title>
  <meta name="description" content="{esc_q(description)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./styles.css?v=20" />
</head>

<body>
  <a class="skip-link" href="#content">Hopp til innhold</a>
  <div class="process-drawer" id="processDrawer" aria-hidden="true">
    <button class="process-drawer__close" id="processDrawerClose" aria-label="Lukk">✕</button>
    <div class="process-drawer__inner" id="processDrawerContent"></div>
  </div>
  <div class="process-drawer__backdrop" id="processBackdrop"></div>
  <div class="lb-overlay" id="lbOverlay" role="dialog" aria-modal="true" aria-label="Forstørret bilde">
    <button class="lb-close" id="lbClose" aria-label="Lukk">✕</button>
    <button class="lb-prev" id="lbPrev" aria-label="Forrige">&#8592;</button>
    <img id="lbImg" src="" alt="">
    <button class="lb-next" id="lbNext" aria-label="Neste">&#8594;</button>
  </div>

  <header class="sidebar sidebar--detail" id="sidebar">
    <div class="sidebar__inner">
      <div class="brand">
        <a class="brand__mark" href="./projects.html" aria-label="Back to work">
          <span class="brand__logo">JOSEFINE R.G</span>
        </a>
      </div>
      <a class="back-btn" href="./projects.html" aria-label="Tilbake til arbeider"><svg width="9" height="16" viewBox="0 0 9 16" fill="none" aria-hidden="true"><path d="M8 1L1 8L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <nav class="nav" aria-label="Main navigation">
        <a class="nav__link" href="./projects.html"><span>Arbeider</span></a>
        <a class="nav__link" href="./projects.html#about"><span>Om</span></a>
        <a class="nav__link" href="./projects.html#contact"><span>Kontakt</span></a>
      </nav>
      <footer class="meta">
        <p class="meta__small">© <span id="year"></span> Josefine Gjertsen</p>
      </footer>
      <button class="sidebar__toggle" id="sidebarToggle" aria-expanded="false" aria-controls="sidebar">Meny</button>
    </div>
  </header>

  <main id="content" class="content">
    <article class="project" id="project">{project_html}
    </article>
  </main>

  <script src="./projects.js?v=6"></script>
  <script>{js}</script>
</body>
</html>"""


# ── Generate files ────────────────────────────────────────────────────────────

count = 0
for project in PROJECTS:
    if project.get("skipBuild"):
        print(f'  (skipping {project["id"]}.html — skipBuild)')
        continue
    html = render_page(project)
    out_path = os.path.join(SCRIPT_DIR, f'{project["id"]}.html')
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f'✓ {project["id"]}.html')
    count += 1

print(f'\nGenerated {count} static project pages.')
