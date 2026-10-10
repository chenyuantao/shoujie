(() => {
  const STORAGE_KEY = "shoujie-v1";

  const QUOTES = [
    "学会处理冲突，不是变得尖酸刻薄，而是掌握温和坚定的沟通方式。",
    "善良是我愿意体谅别人，但我有守住底线的底气。",
    "合理的争执只是厘清问题，不会毁掉一段正常关系。",
    "不必为了迎合他人一味退让，拥有处理矛盾的底气，才能活得坦荡。",
    "冲突不会因为逃避消失，只会变成夜里反复回放的片子。",
    "真正通透的人，心底保留善意，同时拥有直面冲突的能力。",
  ];

  const MODES = {
    retreat: {
      name: "一味退让",
      short: "息事宁人",
      desc: "遇到侵占、指责、得寸进尺时，你习惯主动妥协。看似顾全大局，实则用牺牲自己换短暂平静。",
      antidote: "把「怕伤和气」改成「当面说清立场」。先练最短的拒绝句：这件事我这次做不了。",
      tip: "别人试探是循序渐进的。你一旦开始温和拒绝，边界会被重新校准。",
    },
    suppress: {
      name: "压抑情绪",
      short: "事后内耗",
      desc: "冲突当下不敢表达，事后却反复回放，越想越憋屈。愤怒委屈全压在心底，最后变成自我否定。",
      antidote: "训练「当下说感受」：刚才那句话让我不太舒服，我想补充一下事实。",
      tip: "情绪说过就卸一半；憋着会整夜失眠。先客观描述感受，再谈诉求。",
    },
    blame: {
      name: "自我归因",
      short: "先认错讨好",
      desc: "哪怕错不在己，一有矛盾就反思「是不是我不好」。恐惧对立，宁可低头也不愿对峙。",
      antidote: "先问自己：事实证据在哪里？有证据就不先道歉。改成：我们先把事实对齐。",
      tip: "产生分歧是常态。不必把每一次对立都翻译成「我有罪」。",
    },
  };

  const QUIZ = [
    {
      q: "同事把不属于你的杂活甩过来，说「你顺手做一下吧」。你更可能？",
      options: [
        { t: "接下，再自己加班消化", m: "retreat" },
        { t: "没拒绝，回家越想越委屈", m: "suppress" },
        { t: "先说「好的对不起，我刚才是不是让你觉得我闲」", m: "blame" },
      ],
    },
    {
      q: "会上有人当众把延期责任推给你，而你其实提前同步过风险。你更可能？",
      options: [
        { t: "当场低头不争，会后默默补救", m: "retreat" },
        { t: "当场不说，晚上失眠回放整场会", m: "suppress" },
        { t: "立刻道歉「可能是我没讲清楚」", m: "blame" },
      ],
    },
    {
      q: "领导临时加活，明显超出你的容量。你更可能？",
      options: [
        { t: "全部应下，牺牲睡眠也要交差", m: "retreat" },
        { t: "嘴上答应，心里生闷气但不说", m: "suppress" },
        { t: "担心自己不够努力，先自责再硬扛", m: "blame" },
      ],
    },
    {
      q: "朋友/同事反复占你小便宜，你心里已经烦了。你更可能？",
      options: [
        { t: "继续给，怕撕破脸", m: "retreat" },
        { t: "表面客气，开始悄悄疏远", m: "suppress" },
        { t: "觉得是自己不够大度，继续迁就", m: "blame" },
      ],
    },
    {
      q: "有人语气不好、无端冒犯你。你更可能？",
      options: [
        { t: "装作没事，尽快结束对话", m: "retreat" },
        { t: "忍着，事后反复咀嚼那句话", m: "suppress" },
        { t: "反思「是不是我哪里惹到对方了」", m: "blame" },
      ],
    },
    {
      q: "你和同事意见不合，需要当面讨论。你身体里的第一反应是？",
      options: [
        { t: "能躲就躲，能让就让", m: "retreat" },
        { t: "紧张、胸口发紧，事后才想出反驳", m: "suppress" },
        { t: "先假设自己错了，准备道歉脚本", m: "blame" },
      ],
    },
  ];

  const SCENARIOS = [
    {
      id: "s1",
      cat: "workload",
      title: "同事甩来不属于你的活",
      tag: "甩锅/推活",
      setup: "临近下班，同事小张把一份报表丢给你。",
      line: "「你顺手做一下呗，你比较细心，我这边忙不过来。」",
      choices: [
        {
          text: "「好吧……那我今晚做。」",
          type: "retreat",
          feedback: "这是典型的一味退让。短暂息事宁人，却牺牲了你的时间和边界。",
        },
        {
          text: "不说话接下，心里骂一句，回家生闷气。",
          type: "suppress",
          feedback: "压抑型逃避：冲突没解决，夜里会内耗。对方还会继续来。",
        },
        {
          text: "「我理解你着急。但这份报表不在我职责里，我今晚也排满了。你可以找主管协调优先级，或明天上午我帮你看一眼关键项。」",
          type: "assert",
          feedback: "温和坚定：承认对方难处 + 清晰拒绝 + 给出可选边界内的帮助。",
        },
        {
          text: "「对不起对不起，是不是我平时让你觉得我很闲……」",
          type: "blame",
          feedback: "自我归因。对方推活不代表你有错，先道歉会强化「你就该扛」的预期。",
        },
      ],
      model:
        "「小张，这个报表不属于我这边。我今晚已经排满了。如果你这边确实紧急，建议一起找主管重新排优先级；我也可以明天上午帮你核对关键数字。」",
      coaching: [
        "先定归属：谁的职责？",
        "再说容量：我能不能做？",
        "最后给出路：协调或有限帮助，而不是全盘接收。",
      ],
    },
    {
      id: "s2",
      cat: "credit",
      title: "会上被当众背锅",
      tag: "功劳/背锅",
      setup: "周会复盘延期。项目经理看着你说：",
      line: "「这次延期主要是前端这边信息不同步造成的。」（你周三已在群里预警）",
      choices: [
        {
          text: "沉默点头，会后自己加班补锅。",
          type: "retreat",
          feedback: "退让会让「你背锅」成为默认叙事。事实记录在，却没被看见。",
        },
        {
          text: "当场不辩，会后反复想「我该不该当场说」。",
          type: "suppress",
          feedback: "事后内耗的经典路径。当下不说清，记录里就只剩那句指责。",
        },
        {
          text: "「关于同步，我周三 15:20 在项目群发过风险说明，并 @了相关同学。我们可以把聊天记录投一下，再一起看卡点在哪、怎么补救。」",
          type: "assert",
          feedback: "就事论事：用时间戳与证据对齐事实，同时把对话拉回「怎么补救」。",
        },
        {
          text: "「可能是我没讲清楚，都是我的问题……」",
          type: "blame",
          feedback: "错不在己时先认错，会把责任固定在你身上，后续更难翻盘。",
        },
      ],
      model:
        "「我想补充一个事实：周三下午我在群里同步过延期风险，并 @了相关同学。建议我们把记录对齐后，再分工补救，避免同类问题再发生。」",
      coaching: [
        "不攻击人，只摆事实。",
        "把「对错审判」转成「对齐记录 + 补救」。",
        "语气平稳，比音量更能守住体面。",
      ],
    },
    {
      id: "s3",
      cat: "meeting",
      title: "方案被打断、不被听见",
      tag: "会议冲突",
      setup: "你正在讲方案，同事频繁打断并否定。",
      line: "「行了行了，这个方向不行，别浪费时间。」",
      choices: [
        {
          text: "立刻收住，「那……你们定吧。」",
          type: "retreat",
          feedback: "退让让你的专业贡献消失。会议里不发言，决策里就没有你。",
        },
        {
          text: "忍着听完，会后跟别人吐槽。",
          type: "suppress",
          feedback: "冷战式沟通。关系会僵，问题仍在桌上。",
        },
        {
          text: "「我先把关键三点讲完，两分钟。讲完我们再一起否决或调整，这样讨论更高效。」",
          type: "assert",
          feedback: "守发言权：温和请求完整表达，把打断变成有结构的讨论。",
        },
        {
          text: "「对不起，可能是我想得太理想了……」",
          type: "blame",
          feedback: "未经验证就自我否定。先讲完，再一起评估是否理想。",
        },
      ],
      model:
        "「我听到你的顾虑了。请给我两分钟把关键结论讲完，然后我们针对你担心的点逐条讨论，可以吗？」",
      coaching: [
        "先接住对方情绪（听到了），再要发言空间。",
        "给明确时长，降低对方不耐烦。",
        "把对抗变成「逐条讨论」。",
      ],
    },
    {
      id: "s4",
      cat: "boundary",
      title: "领导习惯性下班加活",
      tag: "边界侵犯",
      setup: "晚上 9 点，领导发消息：",
      line: "「这个明天一早要用，你今晚处理一下。」（你已连续一周加班）",
      choices: [
        {
          text: "「好的领导，我现在做。」",
          type: "retreat",
          feedback: "无底线响应会训练对方：你永远在线。边界会被持续突破。",
        },
        {
          text: "已读不回，心里慌又气。",
          type: "suppress",
          feedback: "逃避制造更大不确定性。对方可能更频繁催，你也更内耗。",
        },
        {
          text: "「我理解明早要用。我今晚已经关机休息了，最早明天 8:30 到公司处理；如果必须今晚完成，需要明确这是紧急优先级，并调整我明天其他交付。」",
          type: "assert",
          feedback: "清晰边界 + 可选路径：要么明早做，要么正式升级优先级并换取资源。",
        },
        {
          text: "「对不起领导，是我白天不够快……我马上做。」",
          type: "blame",
          feedback: "把系统性加班归因成个人罪责。长期会透支健康与自信。",
        },
      ],
      model:
        "「收到。今晚我这边已经结束工作了。我可以明天一早就处理；若必须今晚交付，请帮我确认这是 P0，并同步哪些事项可以延后。」",
      coaching: [
        "把「个人态度」换成「优先级与资源」。",
        "给两个可行选项，而不是硬刚或硬扛。",
        "重复出现时，再约一次一对一谈期望与负载。",
      ],
    },
    {
      id: "s5",
      cat: "credit",
      title: "你的功劳被顺走",
      tag: "功劳/背锅",
      setup: "你主导的方案上线成功。汇报时同事说：",
      line: "「我们一起做的，主要是我这边推动的。」",
      choices: [
        {
          text: "笑笑不说话，怕显得计较。",
          type: "retreat",
          feedback: "不计较一次，叙事就会定型。职业声誉需要被准确陈述。",
        },
        {
          text: "会后越想越气，开始疏远对方。",
          type: "suppress",
          feedback: "冷战代替澄清。关系坏了，事实仍没被纠正。",
        },
        {
          text: "「补充一下分工：需求梳理和方案设计由我主导，小李负责联调推动。大家一起才有结果，记录里也可以按这个写。」",
          type: "assert",
          feedback: "不贬低对方，只精确分工。既守功劳，也留合作体面。",
        },
        {
          text: "「主要还是大家，我其实没做什么……」",
          type: "blame",
          feedback: "过度谦虚在职场会被当成事实。谦逊可以，自我抹去贡献不行。",
        },
      ],
      model:
        "「我想把分工说清楚：方案与核心设计是我主导推进的，联调与落地也有小李的重要贡献。建议纪要按实际分工记录，方便后续复盘。」",
      coaching: [
        "用「补充分工」代替「你抢功」。",
        "同时肯定合作，降低对方防卫。",
        "落到纪要/文档，让事实可追踪。",
      ],
    },
    {
      id: "s6",
      cat: "boundary",
      title: "被要求做道德绑架式帮忙",
      tag: "边界侵犯",
      setup: "同事第三次请你代做他的周报，并说：",
      line: "「你人最好了，帮兄弟一把，就你能帮我。」",
      choices: [
        {
          text: "「……行吧，最后一次。」（第四次还会来）",
          type: "retreat",
          feedback: "「最后一次」若无代价，就会变成下一次的开始。",
        },
        {
          text: "帮了，但开始阴阳怪气、冷暴力。",
          type: "suppress",
          feedback: "用冷战惩罚对方，对方未必懂，你却先耗尽自己。",
        },
        {
          text: "「我理解你赶时间。周报我帮不了，这是你需要对齐的工作。如果你卡在某个数据口径，我可以花五分钟告诉你怎么取数。」",
          type: "assert",
          feedback: "拒绝任务本体，保留有限技术支持。把「好人」从「工具人」里拆出来。",
        },
        {
          text: "「不好意思，我是不是显得太闲了才总找我……」",
          type: "blame",
          feedback: "被夸「人好」不是罪。无需为他人的依赖而自责。",
        },
      ],
      model:
        "「谢谢你信任我。代写周报这件事我帮不了，这属于你要对齐的产出。若你卡在数据口径，我可以口头讲五分钟方法，之后还是需要你自己完成。」",
      coaching: [
        "先接「信任」，再拒「事务」。",
        "区分：教方法可以，代劳不行。",
        "重复第三次时，拒绝要更短、更稳。",
      ],
    },
  ];

  const SCRIPTS = [
    {
      id: "p1",
      tags: ["拒绝", "推活", "加班"],
      title: "拒绝不属于自己的工作",
      phrase:
        "这件事目前不在我的职责范围，我这周也排满了。若优先级更高，我们一起找主管重新排；我也可以在边界内提供有限协助。",
      why: "承认现实 + 拒绝全盘接收 + 给组织内协调路径。",
    },
    {
      id: "p2",
      tags: ["背锅", "会议", "澄清"],
      title: "当众澄清事实（不攻击人）",
      phrase:
        "我想补充一个事实：我在【时间】已通过【渠道】同步过【内容】。我们先对齐记录，再一起看怎么补救。",
      why: "用证据代替情绪对线，把战场从「态度」拉回「事实」。",
    },
    {
      id: "p3",
      tags: ["感受", "即时表达"],
      title: "当下表达不适",
      phrase: "刚才那句话让我有点被误解了。我想花一分钟把事实说清楚。",
      why: "及时表达，减少事后内耗；请求明确时长，降低冲突温度。",
    },
    {
      id: "p4",
      tags: ["打断", "发言权"],
      title: "会议中被打断",
      phrase:
        "我听到你的顾虑了。请给我两分钟把关键点讲完，然后我们针对你的担心逐条讨论。",
      why: "先接住对方，再守表达权，把打断变成结构化讨论。",
    },
    {
      id: "p5",
      tags: ["加班", "边界", "领导"],
      title: "下班后被加急",
      phrase:
        "我理解明早要用。今晚我这边已经结束工作了。我可以明天一早处理；若必须今晚完成，请确认这是紧急优先级，并同步哪些事项可以延后。",
      why: "两个选项把「是否听话」变成「如何配置优先级」。",
    },
    {
      id: "p6",
      tags: ["功劳", "汇报"],
      title: "功劳被模糊时",
      phrase:
        "我想把分工说清楚：【部分】由我主导，【部分】由同事负责。建议纪要按实际分工记录，方便后续复盘。",
      why: "精确陈述贡献，同时保留合作体面。",
    },
    {
      id: "p7",
      tags: ["讨好", "对立"],
      title: "停止习惯性先道歉",
      phrase: "我们先把事实对齐。在事实清楚前，我不适合先承担全责。",
      why: "对抗「自我归因」本能：先证据，后责任。",
    },
    {
      id: "p8",
      tags: ["拒绝", "人情"],
      title: "被「你人最好」绑架",
      phrase:
        "谢谢信任。代劳这件事我帮不了；如果你卡在方法上，我可以花几分钟讲思路，产出还是需要你自己完成。",
      why: "拒事务、留方法，拆开「善良」与「工具人」。",
    },
    {
      id: "p9",
      tags: ["情绪", "冷静"],
      title: "冲突升温时降温",
      phrase:
        "我们都希望把事情做好。先暂停人身评价，回到具体问题上：目标是什么、卡点在哪、各自能承诺什么。",
      why: "就事论事，给双方台阶，避免关系性伤害。",
    },
    {
      id: "p10",
      tags: ["复盘", "后续"],
      title: "事后补对话（曾经隐忍）",
      phrase:
        "上次【事件】我当时没说清楚，事后一直耿耿于怀。我想补一句：我的边界是【……】，希望以后我们按这个来协作。",
      why: "把积压的冷战，转成一次迟到但清晰的对齐。",
    },
  ];

  const TODAY_TASKS = [
    { id: "t-mirror", label: "完成一次「照镜」自评", view: "mirror" },
    { id: "t-drill", label: "完成 1 场情景演练", view: "drill" },
    { id: "t-script", label: "收藏/抄下一句可用话术", view: "scripts" },
  ];

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveState(patch) {
    const next = { ...loadState(), ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function touchStreak() {
    const state = loadState();
    const today = todayKey();
    if (state.lastActive === today) return state.streak || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
    const streak = state.lastActive === yKey ? (state.streak || 0) + 1 : 1;
    saveState({ lastActive: today, streak });
    return streak;
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function markToday(taskId) {
    const state = loadState();
    const today = todayKey();
    const done = { ...(state.todayDone || {}) };
    if (!done[today]) done[today] = {};
    done[today][taskId] = true;
    saveState({ todayDone: done });
    touchStreak();
    renderHomeExtras();
  }

  /* ---------- Navigation ---------- */
  const views = [...document.querySelectorAll(".view")];
  const navItems = [...document.querySelectorAll(".nav-item")];
  const sidebar = document.getElementById("sidebar");
  const topbarTitle = document.getElementById("topbarTitle");

  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("show");
  }

  function go(viewId) {
    views.forEach((v) => v.classList.toggle("active", v.id === `view-${viewId}`));
    navItems.forEach((n) => n.classList.toggle("active", n.dataset.view === viewId));
    const view = document.getElementById(`view-${viewId}`);
    topbarTitle.textContent = view?.dataset.title || "";
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (viewId === "drill") renderScenarios(currentFilter);
    if (viewId === "journal") renderJournal();
    if (viewId === "scripts") renderScripts();
    if (viewId === "mirror") renderQuiz();
    if (viewId === "home") renderHomeExtras();
  }

  navItems.forEach((btn) => btn.addEventListener("click", () => go(btn.dataset.view)));
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => go(el.dataset.go));
  });
  document.getElementById("menuBtn").addEventListener("click", () => {
    sidebar.classList.add("open");
    backdrop.classList.add("show");
  });
  backdrop.addEventListener("click", closeMenu);

  /* ---------- Home ---------- */
  function renderHomeExtras() {
    document.getElementById("dailyQuote").textContent =
      QUOTES[new Date().getDate() % QUOTES.length];

    const streak = loadState().streak || 0;
    document.getElementById("streakDays").textContent = streak;

    const doneMap = (loadState().todayDone || {})[todayKey()] || {};
    const doneCount = TODAY_TASKS.filter((t) => doneMap[t.id]).length;
    document.getElementById("todayProgress").textContent = `${doneCount} / ${TODAY_TASKS.length}`;

    const list = document.getElementById("todayList");
    list.innerHTML = TODAY_TASKS.map((t) => {
      const done = !!doneMap[t.id];
      return `
        <div class="today-item ${done ? "done" : ""}">
          <div class="check">${done ? "✓" : ""}</div>
          <div>${t.label}</div>
          <button class="btn small ghost" data-go-task="${t.view}">${done ? "再看一次" : "去完成"}</button>
        </div>`;
    }).join("");
    list.querySelectorAll("[data-go-task]").forEach((btn) => {
      btn.addEventListener("click", () => go(btn.dataset.goTask));
    });
  }

  /* ---------- Mirror / Quiz ---------- */
  let quizIndex = 0;
  let quizScores = { retreat: 0, suppress: 0, blame: 0 };

  function renderQuiz() {
    const state = loadState();
    const box = document.getElementById("mirrorQuiz");
    const result = document.getElementById("mirrorResult");

    if (state.mirrorResult && quizIndex === 0 && !box.dataset.force) {
      // keep going fresh each visit unless mid-quiz; show restart option via full quiz
    }

    result.classList.add("hidden");
    box.classList.remove("hidden");

    if (quizIndex >= QUIZ.length) {
      showMirrorResult();
      return;
    }

    const item = QUIZ[quizIndex];
    const pct = Math.round((quizIndex / QUIZ.length) * 100);
    box.innerHTML = `
      <div class="quiz-progress"><span style="width:${pct}%"></span></div>
      <div class="quiz-card">
        <div class="q-meta">第 ${quizIndex + 1} / ${QUIZ.length} 题</div>
        <h2>${item.q}</h2>
        <div class="options">
          ${item.options
            .map(
              (o, i) =>
                `<button class="option" data-m="${o.m}">${String.fromCharCode(65 + i)}. ${o.t}</button>`
            )
            .join("")}
        </div>
      </div>`;

    box.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        quizScores[btn.dataset.m] += 1;
        quizIndex += 1;
        renderQuiz();
      });
    });
  }

  function showMirrorResult() {
    const box = document.getElementById("mirrorQuiz");
    const result = document.getElementById("mirrorResult");
    box.classList.add("hidden");
    result.classList.remove("hidden");

    const total = Object.values(quizScores).reduce((a, b) => a + b, 0) || 1;
    const ranked = Object.entries(quizScores).sort((a, b) => b[1] - a[1]);
    const top = ranked[0][0];
    const mode = MODES[top];

    result.innerHTML = `
      <div class="eyebrow">你的主导逃避模式</div>
      <h2>${mode.name}</h2>
      <p>${mode.desc}</p>
      <div class="mode-bars">
        ${ranked
          .map(([k, v]) => {
            const pct = Math.round((v / total) * 100);
            return `<div class="mode-bar-row">
              <span>${MODES[k].short}</span>
              <div class="mode-bar"><i style="width:${pct}%"></i></div>
              <span>${pct}%</span>
            </div>`;
          })
          .join("")}
      </div>
      <div class="antidote">
        <strong>对症练习</strong>
        ${mode.antidote}<br /><br />
        <em>${mode.tip}</em>
      </div>
      <div class="drill-actions">
        <button class="btn primary" id="toDrill">去演练对应场景</button>
        <button class="btn ghost" id="retryQuiz">再测一次</button>
      </div>`;

    saveState({
      mirrorResult: { top, scores: quizScores, at: Date.now() },
    });
    markToday("t-mirror");

    document.getElementById("toDrill").addEventListener("click", () => go("drill"));
    document.getElementById("retryQuiz").addEventListener("click", () => {
      quizIndex = 0;
      quizScores = { retreat: 0, suppress: 0, blame: 0 };
      renderQuiz();
    });
  }

  /* ---------- Drill ---------- */
  let currentFilter = "all";

  function renderScenarios(filter) {
    currentFilter = filter;
    document.querySelectorAll("#drillFilters .chip-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    const grid = document.getElementById("scenarioGrid");
    const stage = document.getElementById("drillStage");
    stage.classList.add("hidden");

    const list = SCENARIOS.filter((s) => filter === "all" || s.cat === filter);
    grid.classList.remove("hidden");
    grid.innerHTML = list
      .map(
        (s) => `
      <button class="scenario-card" data-id="${s.id}">
        <span class="tag">${s.tag}</span>
        <h3>${s.title}</h3>
        <p>${s.setup}</p>
      </button>`
      )
      .join("");

    grid.querySelectorAll(".scenario-card").forEach((card) => {
      card.addEventListener("click", () => openScenario(card.dataset.id));
    });
  }

  document.querySelectorAll("#drillFilters .chip-btn").forEach((btn) => {
    btn.addEventListener("click", () => renderScenarios(btn.dataset.filter));
  });

  function openScenario(id) {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    const grid = document.getElementById("scenarioGrid");
    const stage = document.getElementById("drillStage");
    grid.classList.add("hidden");
    stage.classList.remove("hidden");

    stage.innerHTML = `
      <button class="btn text" id="backScenarios">← 返回场景列表</button>
      <div class="scene-box">
        <div class="who">${s.setup}</div>
        <div class="line">${s.line}</div>
      </div>
      <div class="step-label">第一步：你的本能会怎么回？请选择最接近的一项</div>
      <div class="options" id="choiceBox">
        ${s.choices
          .map(
            (c, i) =>
              `<button class="option" data-i="${i}">${String.fromCharCode(65 + i)}. ${c.text}</button>`
          )
          .join("")}
      </div>
      <div id="choiceFeedback"></div>
      <div id="customBlock" class="hidden" style="margin-top:18px">
        <div class="step-label">第二步：用自己的话写一句「温和坚定」回应</div>
        <textarea id="customReply" rows="3" placeholder="试着包含：立场 / 感受或事实 / 可选出路"></textarea>
        <div class="drill-actions">
          <button class="btn secondary" id="checkCustom">对照示范</button>
        </div>
        <div id="customFeedback"></div>
      </div>`;

    document.getElementById("backScenarios").addEventListener("click", () => {
      stage.classList.add("hidden");
      grid.classList.remove("hidden");
    });

    stage.querySelectorAll("#choiceBox .option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = s.choices[Number(btn.dataset.i)];
        const good = choice.type === "assert";
        const fb = document.getElementById("choiceFeedback");
        fb.innerHTML = `
          <div class="feedback ${good ? "good" : "warn"}">
            <h4>${good ? "这是守界方向" : "这是逃避模式的变体"}</h4>
            <p>${choice.feedback}</p>
            ${
              good
                ? ""
                : `<div class="model-reply"><strong>可参考：</strong><br/>${s.model}</div>`
            }
          </div>`;
        document.getElementById("customBlock").classList.remove("hidden");
        markToday("t-drill");

        const state = loadState();
        const drills = state.drillsDone || {};
        drills[s.id] = (drills[s.id] || 0) + 1;
        saveState({ drillsDone: drills });
        touchStreak();
      });
    });

    document.getElementById("checkCustom").addEventListener("click", () => {
      const text = document.getElementById("customReply").value.trim();
      const out = document.getElementById("customFeedback");
      if (!text) {
        toast("先写下你的那一句");
        return;
      }
      const tips = critiqueReply(text);
      out.innerHTML = `
        <div class="feedback good">
          <h4>对照反馈</h4>
          <ul>${tips.map((t) => `<li>${t}</li>`).join("")}</ul>
          <div class="model-reply"><strong>示范回应：</strong><br/>${s.model}</div>
          <p style="margin:12px 0 0;font-size:13px;color:var(--ink-soft)">教练要点：${s.coaching.join(" · ")}</p>
        </div>`;
      toast("已对照示范，可再改一版");
    });
  }

  function critiqueReply(text) {
    const tips = [];
    const softApologize = /对不起|抱歉我不好|都是我的问题|怪我/;
    const clearBoundary = /不在|做不了|帮不了|排满|边界|职责|优先级|我需要|我可以/;
    const fact = /事实|记录|同步|周三|群里|纪要|时间/;
    const option = /或者|可以|一起|明天|如果|建议/;

    if (softApologize.test(text) && !/抱歉.?让你久等|抱歉.?回复晚/.test(text)) {
      tips.push("检测到习惯性认错味道。若错不在你，把道歉换成事实对齐。");
    } else {
      tips.push("没有不必要的自我归因，很好。");
    }
    if (clearBoundary.test(text)) {
      tips.push("有清晰立场/边界表达。");
    } else {
      tips.push("可再明确一句立场：我能做什么 / 不能做什么。");
    }
    if (fact.test(text)) {
      tips.push("带上了事实或时间线索，有助于就事论事。");
    } else {
      tips.push("若场景有证据，补一个具体事实会更稳。");
    }
    if (option.test(text)) {
      tips.push("给出了可选出路，对方更容易接受。");
    } else {
      tips.push("可加一个建设性选项，减少「硬刚」感。");
    }
    if (text.length < 20) {
      tips.push("稍短。完整句式通常包含：立场 + 事实/感受 + 出路。");
    }
    return tips;
  }

  /* ---------- Scripts ---------- */
  function renderScripts(filter = "") {
    const q = filter.trim().toLowerCase();
    const list = document.getElementById("scriptList");
    const state = loadState();
    const saved = new Set(state.savedScripts || []);

    const items = SCRIPTS.filter((s) => {
      if (!q) return true;
      const blob = `${s.title} ${s.phrase} ${s.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });

    if (!items.length) {
      list.innerHTML = `<div class="empty">没有匹配的话术，换个关键词试试。</div>`;
      return;
    }

    list.innerHTML = items
      .map(
        (s) => `
      <article class="script-item" data-id="${s.id}">
        <div class="meta">${s.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        <h3>${s.title}</h3>
        <div class="phrase">${s.phrase}</div>
        <p class="why">${s.why}</p>
        <div class="row">
          <button class="btn small copy" data-copy="${s.id}">复制话术</button>
          <button class="btn small ghost" data-save="${s.id}">${
            saved.has(s.id) ? "已收藏" : "收藏"
          }</button>
        </div>
      </article>`
      )
      .join("");

    list.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const item = SCRIPTS.find((x) => x.id === btn.dataset.copy);
        try {
          await navigator.clipboard.writeText(item.phrase);
          toast("已复制到剪贴板");
          markToday("t-script");
        } catch {
          toast("复制失败，请手动选择文本");
        }
      });
    });

    list.querySelectorAll("[data-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.save;
        const st = loadState();
        const arr = new Set(st.savedScripts || []);
        if (arr.has(id)) arr.delete(id);
        else {
          arr.add(id);
          markToday("t-script");
          toast("已收藏");
        }
        saveState({ savedScripts: [...arr] });
        renderScripts(document.getElementById("scriptSearch").value);
      });
    });
  }

  document.getElementById("scriptSearch").addEventListener("input", (e) => {
    renderScripts(e.target.value);
  });

  /* ---------- Journal ---------- */
  function renderJournal() {
    const list = document.getElementById("journalList");
    const entries = (loadState().journal || []).slice().reverse();
    if (!entries.length) {
      list.innerHTML = `<div class="empty">还没有复盘。最近一次忍住没说的事，就是最好的素材。</div>`;
      return;
    }
    const labels = {
      retreat: "一味退让",
      suppress: "压抑情绪",
      blame: "自我归因",
      assert: "已尝试表达",
    };
    list.innerHTML = entries
      .map(
        (e) => `
      <article class="journal-entry">
        <div class="when">${new Date(e.at).toLocaleString("zh-CN")} · ${labels[e.instinct] || ""}</div>
        <h4>事实</h4>
        <p>${escapeHtml(e.fact)}</p>
        <h4>没说出口的</h4>
        <p>${escapeHtml(e.unsaid)}</p>
        <h4>下次准备怎么说</h4>
        <p>${escapeHtml(e.next)}</p>
      </article>`
      )
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.getElementById("journalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const entry = {
      at: Date.now(),
      fact: fd.get("fact").toString().trim(),
      instinct: fd.get("instinct").toString(),
      unsaid: fd.get("unsaid").toString().trim(),
      next: fd.get("next").toString().trim(),
    };
    const journal = loadState().journal || [];
    journal.push(entry);
    saveState({ journal });
    touchStreak();
    e.target.reset();
    renderJournal();
    toast("复盘已保存。下次冲突，先翻出「下次怎么说」。");
  });

  document.getElementById("clearJournal").addEventListener("click", () => {
    if (!confirm("确定清空全部复盘记录？")) return;
    saveState({ journal: [] });
    renderJournal();
    toast("已清空");
  });

  /* ---------- Boot ---------- */
  touchStreak();
  renderHomeExtras();
  renderQuiz();
  renderScenarios("all");
  renderScripts();
  renderJournal();
})();
