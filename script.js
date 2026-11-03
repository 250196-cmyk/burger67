const searchInput = document.querySelector('#searchInput');
const recipeCards = document.querySelectorAll('.recipe-card');
const modal = document.querySelector('#recipeModal');
const modalTitle = document.querySelector('#modalTitle');
const modalText = document.querySelector('#modalText');
const modalImage = document.querySelector('#modalImage');
const closeButton = document.querySelector('#closeModal');
const heroModal = document.querySelector('#heroModal');
const heroModalTitle = document.querySelector('#heroModalTitle');
const heroModalPower = document.querySelector('#heroModalPower');
const heroModalDescription = document.querySelector('#heroModalDescription');
const closeHeroModalButton = document.querySelector('#closeHeroModal');
const parallaxItems = document.querySelectorAll('[data-parallax]');
const heroBackground = document.querySelector('.hero-bg');
const scrollToTopButton = document.querySelector('#scrollToTopButton');

const openRecipeModal = (card) => {
  if (!modal || !modalTitle || !modalText || !modalImage) return;

  modalTitle.textContent = card.dataset.title || card.querySelector('h3')?.textContent || 'Рецепт';
  modalText.textContent = card.dataset.text || card.querySelector('p')?.textContent || '';

  const image = card.querySelector('img');
  modalImage.src = image ? image.src : '';
  modalImage.alt = image ? image.alt : 'Фото рецепта';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

const closeRecipeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim().toLowerCase();

    recipeCards.forEach((card) => {
      const title = (card.dataset.title || '').toLowerCase();
      const text = (card.dataset.text || '').toLowerCase();
      const matches = title.includes(value) || text.includes(value);

      card.classList.toggle('hidden', !matches && value !== '');

      if (value === '') {
        card.classList.remove('hidden');
      }
    });
  });
}

recipeCards.forEach((card) => {
  card.addEventListener('click', () => {
    openRecipeModal(card);
    if (typeof showRecipeDetails === 'function') showRecipeDetails(card);
  });
});

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeRecipeModal();
    }
  });
}

if (closeButton) {
  closeButton.addEventListener('click', closeRecipeModal);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeRecipeModal();
  }
  if (event.key === 'Escape' && heroModal?.classList.contains('open')) {
    heroModal.classList.remove('open');
    heroModal.setAttribute('aria-hidden', 'true');
  }
});

document.querySelectorAll('.hero-character').forEach((character) => {
  character.addEventListener('click', () => {
    if (!heroModal || !heroModalTitle || !heroModalPower || !heroModalDescription) return;
    heroModalTitle.textContent = character.dataset.name ||
      character.querySelector('.hero-character__name')?.textContent.trim() ||
      'Герой';
    heroModalPower.textContent = character.dataset.power || '';
    heroModalDescription.textContent = character.dataset.description || '';
    heroModal.classList.add('open');
    heroModal.setAttribute('aria-hidden', 'false');
  });
});

document.querySelectorAll('.hero-avatar__image').forEach((image) => {
  image.addEventListener('error', () => image.classList.add('is-placeholder'), { once: true });
  if (image.complete && image.naturalWidth === 0) image.classList.add('is-placeholder');
});

closeHeroModalButton?.addEventListener('click', () => {
  heroModal?.classList.remove('open');
  heroModal?.setAttribute('aria-hidden', 'true');
});

heroModal?.addEventListener('click', (event) => {
  if (event.target === heroModal) {
    heroModal.classList.remove('open');
    heroModal.setAttribute('aria-hidden', 'true');
  }
});

document.querySelectorAll('[data-crew-filter]').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const faction = filterButton.dataset.crewFilter;
    document.querySelectorAll('[data-crew-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button === filterButton));
    });
    document.querySelectorAll('.hero-character').forEach((character) => {
      character.hidden = character.dataset.faction !== faction;
    });
  });
});

const awakeningButton = document.querySelector('.awakening-button');
awakeningButton?.addEventListener('click', () => {
  const awakened = document.body.classList.toggle('power-awakened');
  awakeningButton.setAttribute('aria-pressed', String(awakened));
  awakeningButton.textContent = awakened ? 'ЭНЕРГИЯ ПРОБУЖДЕНА' : 'ПРОБУДИ СВОЮ ЭНЕРГИЮ';
});

const updateParallax = () => {
  const scrollY = window.scrollY;

  if (heroBackground) {
    heroBackground.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0) scale(1.02)`;
  }

  const header = document.querySelector('header');
  if (header) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallaxOffset = reducedMotion ? 0 : Math.max(-40, -scrollY * 0.16);
    header.style.setProperty('--header-parallax-y', `${parallaxOffset}px`);
  }
};

const resetParallax = () => {
  parallaxItems.forEach((item) => {
    item.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
  });
  updateParallax();
};

if (parallaxItems.length) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 34;
    const y = (event.clientY / window.innerHeight - 0.5) * 34 + window.scrollY * 0.15;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.1);
      const driftX = x * speed;
      const driftY = y * speed;
      const rotate = (x + y) * speed * 0.5;
      item.style.transform = `translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotate}deg) scale(1.08)`;
    });

    if (heroBackground) {
      heroBackground.style.transform = `translate3d(${x * 0.25}px, ${y * 0.2 + window.scrollY * 0.12}px, 0) scale(1.04)`;
    }
  });

  window.addEventListener('pointerleave', resetParallax);
  window.addEventListener('mouseleave', resetParallax);
}

window.addEventListener('scroll', () => {
  updateParallax();
});

if (scrollToTopButton) {
  const handleScrollToTop = () => {
    scrollToTopButton.hidden = window.scrollY < 300;
  };

  window.addEventListener('scroll', handleScrollToTop);
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  handleScrollToTop();
}

resetParallax();

const recipes = {
  гамбургер: {
    time: 25, difficulty: 'Легко', meat: 'Говядина', spice: 'Не острый',
    ingredients: [
      ['Булочки с кунжутом', 4, 'шт.'], ['Смешанный фарш', 250, 'г'], ['Помидор', 1, 'шт.'],
      ['Листья салата', 4, 'шт.'], ['Сыр', 150, 'г'], ['Маринованный огурец', 1, 'шт.'],
      ['Лук', 1, 'шт.'], ['Горчица', 1, 'ч. л.'], ['Кетчуп', 2, 'ст. л.'], ['Майонез', 2, 'ст. л.']
    ],
    steps: ['Сформируйте четыре котлеты, посолите и обжарьте до полной готовности.', 'Подрумяньте разрезанные булочки на сухой сковороде.', 'Соберите бургеры с соусом, овощами, сыром и котлетой.']
  },
  чизбургер: {
    time: 25, difficulty: 'Легко', meat: 'Говядина', spice: 'Не острый',
    ingredients: [
      ['Булочки с кунжутом', 4, 'шт.'], ['Говяжий фарш', 400, 'г'], ['Сыр чеддер', 4, 'ломтика'],
      ['Помидор', 1, 'шт.'], ['Маринованные огурцы', 2, 'шт.'], ['Репчатый лук', 1, 'шт.'],
      ['Листья салата', 4, 'шт.'], ['Горчица', 1, 'ч. л.'], ['Кетчуп', 2, 'ст. л.'], ['Майонез', 2, 'ст. л.']
    ],
    steps: ['Сформируйте котлеты из фарша, приправьте солью и перцем.', 'Обжарьте котлеты до полной готовности и положите сверху чеддер, чтобы он расплавился.', 'Подрумяньте булочки и соберите бургер с овощами и соусом.']
  },
  бэкон: {
    time: 30, difficulty: 'Средне', meat: 'Говядина', spice: 'Не острый',
    ingredients: [
      ['Булочки с кунжутом', 4, 'шт.'], ['Говяжий фарш', 400, 'г'], ['Бекон', 8, 'ломтиков'],
      ['Сыр чеддер', 4, 'ломтика'], ['Соус барбекю', 4, 'ст. л.'], ['Репчатый лук', 1, 'шт.'],
      ['Маринованные огурцы', 2, 'шт.'], ['Листья салата', 4, 'шт.']
    ],
    steps: ['Обжарьте бекон до хрустящей корочки, затем приготовьте котлеты до полной готовности.', 'Выложите чеддер на горячие котлеты и дайте ему расплавиться.', 'Подрумяньте булочки и соберите бургер с соусом барбекю, овощами и беконом.']
  },
  чикен: {
    time: 35, difficulty: 'Средне', meat: 'Курица', spice: 'Не острый',
    ingredients: [
      ['Булочки с кунжутом', 4, 'шт.'], ['Куриное филе', 400, 'г'], ['Сыр чеддер', 4, 'ломтика'],
      ['Помидор', 1, 'шт.'], ['Листья салата', 4, 'шт.'], ['Маринованные огурцы', 2, 'шт.'],
      ['Майонез', 3, 'ст. л.'], ['Мука', 3, 'ст. л.'], ['Яйцо', 1, 'шт.'], ['Панировочные сухари', 50, 'г']
    ],
    steps: ['Нарежьте курицу на порции, обваляйте в муке, яйце и сухарях.', 'Обжарьте курицу до золотистой корочки и полной готовности внутри.', 'Подрумяньте булочки и соберите бургер с сыром, овощами и майонезом.']
  }
};

const storageRead = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Не удалось прочитать настройку ${key}.`, error);
    return fallback;
  }
};

const storageWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Не удалось сохранить настройку ${key}.`, error);
  }
};

const cards = Array.from(document.querySelectorAll('.recipe-card'));
let favorites = storageRead('burger-favorites', []);
if (!Array.isArray(favorites)) favorites = [];
let ratings = storageRead('burger-ratings', {});
if (!ratings || typeof ratings !== 'object' || Array.isArray(ratings)) ratings = {};
let votes = storageRead('burger-votes', {});
if (!votes || typeof votes !== 'object' || Array.isArray(votes)) votes = {};
const getRecipeData = (card) => {
  const title = `${card.dataset.title || ''} ${card.querySelector('h3')?.textContent || ''}`.toLowerCase();
  return title.includes('чикен') || title.includes('chicken') ? recipes.чикен :
    title.includes('бэкон') || title.includes('bacon') ? recipes.бэкон :
    title.includes('чиз') || title.includes('cheese') ? recipes.чизбургер : recipes.гамбургер;
};

const formatAmount = (value) => {
  const whole = Math.floor(value);
  const fraction = Math.round((value - whole) * 4);
  const fractions = ['', '¼', '½', '¾', ''];
  const remainder = fractions[fraction] || '';
  return `${whole || (!remainder ? 0 : '')}${remainder}`;
};
const getRussianPlural = (value, one, few, many) => {
  if (!Number.isInteger(value)) return few;
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
};
let activeRecipeTimer;
const showRecipeDetails = (card) => {
  if (!modal || !modal.querySelector('.modal-content')) return;
  window.clearInterval(activeRecipeTimer);
  const recipe = getRecipeData(card);
  let detail = modal.querySelector('.recipe-detail');
  if (!detail) {
    detail = document.createElement('section');
    detail.className = 'recipe-detail';
    modal.querySelector('.modal-content').append(detail);
  }
  detail.innerHTML = `
    <p class="recipe-meta"><span>${recipe.time} минут</span><span>${recipe.difficulty}</span><span class="servings-count"></span></p>
    <div class="modal-detail-controls">
      <button type="button" class="servings-minus" aria-label="Уменьшить количество порций">−</button>
      <span>Порций: <strong class="servings-label">4</strong></span>
      <button type="button" class="servings-plus" aria-label="Увеличить количество порций">+</button>
      <button type="button" class="timer-start">Таймер · ${recipe.time} мин</button>
      <span class="timer-status" aria-live="polite"></span>
    </div>
    <h4>Ингредиенты</h4>
    <ul class="ingredient-checklist"></ul>
    <h4>Приготовление</h4>
    <ol>${recipe.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
    <h4>Похожие рецепты</h4>
    <div class="similar-recipes"></div>
    <button type="button" class="print-recipe recipe-open">Распечатать рецепт</button>`;
  let servings = 4;
  const list = detail.querySelector('.ingredient-checklist');
  const renderIngredients = () => {
    detail.querySelector('.servings-count').textContent = `${servings} ${getRussianPlural(servings, 'порция', 'порции', 'порций')}`;
    detail.querySelector('.servings-label').textContent = servings;
    list.innerHTML = recipe.ingredients.map(([name, amount, unit], index) => {
      const scaled = formatAmount(amount * servings / 4);
      const displayUnit = unit === 'ломтика'
        ? getRussianPlural(amount * servings / 4, 'ломтик', 'ломтика', 'ломтиков')
        : unit;
      return `<li><label><input type="checkbox"> ${name} — ${scaled} ${displayUnit}</label></li>`;
    }).join('');
  };
  renderIngredients();
  const similarRecipes = detail.querySelector('.similar-recipes');
  cards.filter((otherCard) => otherCard !== card).slice(0, 2).forEach((otherCard) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recipe-open similar-recipe';
    button.textContent = otherCard.querySelector('h3')?.textContent || 'Рецепт';
    button.addEventListener('click', () => {
      openRecipeModal(otherCard);
      showRecipeDetails(otherCard);
    });
    similarRecipes.append(button);
  });
  detail.querySelector('.servings-minus').addEventListener('click', () => {
    servings = Math.max(1, servings - 1);
    renderIngredients();
  });
  detail.querySelector('.servings-plus').addEventListener('click', () => {
    servings += 1;
    renderIngredients();
  });
  detail.querySelector('.print-recipe').addEventListener('click', () => window.print());
  detail.querySelector('.timer-start').addEventListener('click', (event) => {
    window.clearInterval(activeRecipeTimer);
    let remaining = recipe.time * 60;
    const status = detail.querySelector('.timer-status');
    const updateTimer = () => {
      status.textContent = remaining <= 0 ? 'Готово!' :
        `Осталось ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
      if (remaining <= 0) {
        window.clearInterval(activeRecipeTimer);
        return;
      }
      remaining -= 1;
    };
    event.currentTarget.textContent = 'Таймер запущен';
    updateTimer();
    activeRecipeTimer = window.setInterval(updateTimer, 1000);
  });
};

cards.forEach((card) => {
  const recipe = getRecipeData(card);
  const content = card.querySelector('.recipe-content');
  if (!content) return;
  const title = card.querySelector('h3')?.textContent.trim() || 'Рецепт';
  const key = title.toLowerCase();
  const rating = document.createElement('div');
  rating.className = 'burger-rating';
  rating.setAttribute('role', 'group');
  rating.setAttribute('aria-label', `Оценка: ${title}`);
  const savedRating = Number.isInteger(ratings[key]) && ratings[key] >= 1 && ratings[key] <= 5
    ? ratings[key]
    : 0;
  rating.innerHTML = `
    <div class="burger-rating__stars">
      ${Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        return `<button class="burger-rating__star${value <= savedRating ? ' is-selected' : ''}" type="button" data-rating="${value}" aria-label="${value} из 5" aria-pressed="${value === savedRating}">★</button>`;
      }).join('')}
    </div>
    <span class="burger-rating__label" aria-live="polite">${savedRating ? `Ваша оценка: ${savedRating}/5` : 'Оцените бургер'}</span>`;
  rating.addEventListener('click', (event) => {
    const star = event.target.closest('.burger-rating__star');
    if (!star) return;
    event.stopPropagation();
    const value = Number(star.dataset.rating);
    if (!Number.isInteger(value) || value < 1 || value > 5) return;
    ratings[key] = value;
    storageWrite('burger-ratings', ratings);
    rating.querySelectorAll('.burger-rating__star').forEach((button) => {
      const selected = Number(button.dataset.rating) <= value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(Number(button.dataset.rating) === value));
    });
    rating.querySelector('.burger-rating__label').textContent = `Ваша оценка: ${value}/5`;
  });
  content.append(rating);
  const savedVote = votes[key] && typeof votes[key] === 'object' ? votes[key] : {};
  const voteState = {
    likes: Number.isSafeInteger(savedVote.likes) && savedVote.likes >= 0 ? savedVote.likes : 0,
    dislikes: Number.isSafeInteger(savedVote.dislikes) && savedVote.dislikes >= 0 ? savedVote.dislikes : 0,
    choice: savedVote.choice === 'like' || savedVote.choice === 'dislike' ? savedVote.choice : null
  };
  if ((voteState.choice === 'like' && voteState.likes === 0) ||
      (voteState.choice === 'dislike' && voteState.dislikes === 0)) {
    voteState.choice = null;
  }
  const voteControls = document.createElement('div');
  voteControls.className = 'recipe-votes';
  voteControls.setAttribute('role', 'group');
  voteControls.setAttribute('aria-label', `Оценка пользователей: ${title}`);
  voteControls.innerHTML = `
    <button class="recipe-votes__button${voteState.choice === 'like' ? ' is-selected' : ''}" type="button" data-vote="like" aria-label="Нравится" aria-pressed="${voteState.choice === 'like'}">
      <span aria-hidden="true">👍</span><span class="recipe-votes__count">${voteState.likes}</span>
    </button>
    <button class="recipe-votes__button${voteState.choice === 'dislike' ? ' is-selected' : ''}" type="button" data-vote="dislike" aria-label="Не нравится" aria-pressed="${voteState.choice === 'dislike'}">
      <span aria-hidden="true">👎</span><span class="recipe-votes__count">${voteState.dislikes}</span>
    </button>`;
  voteControls.addEventListener('click', (event) => {
    const button = event.target.closest('.recipe-votes__button');
    if (!button) return;
    event.stopPropagation();
    const nextChoice = button.dataset.vote;
    if (nextChoice !== 'like' && nextChoice !== 'dislike') return;

    if (voteState.choice === nextChoice) {
      voteState[nextChoice === 'like' ? 'likes' : 'dislikes'] -= 1;
      voteState.choice = null;
    } else {
      if (voteState.choice) {
        voteState[voteState.choice === 'like' ? 'likes' : 'dislikes'] -= 1;
      }
      voteState[nextChoice === 'like' ? 'likes' : 'dislikes'] += 1;
      voteState.choice = nextChoice;
    }

    votes[key] = { ...voteState };
    storageWrite('burger-votes', votes);
    voteControls.querySelectorAll('.recipe-votes__button').forEach((voteButton) => {
      const selected = voteButton.dataset.vote === voteState.choice;
      voteButton.classList.toggle('is-selected', selected);
      voteButton.setAttribute('aria-pressed', String(selected));
      voteButton.querySelector('.recipe-votes__count').textContent =
        voteState[voteButton.dataset.vote === 'like' ? 'likes' : 'dislikes'];
    });
  });
  content.append(voteControls);
  const actions = document.createElement('div');
  actions.className = 'recipe-actions';
  actions.innerHTML = `<div class="recipe-meta"><span>${recipe.time} мин</span><span>${recipe.difficulty}</span><span>${recipe.ingredients.length} ингредиентов</span></div>
    <div><button class="recipe-open" type="button">Открыть рецепт</button> <button class="favorite-button" type="button" aria-label="Добавить в избранное" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.51L12 21.35Z"/></svg></button></div>`;
  content.append(actions);
  const favoriteButton = actions.querySelector('.favorite-button');
  const favoriteState = favorites.includes(key);
  favoriteButton.classList.toggle('is-favorite', favoriteState);
  favoriteButton.setAttribute('aria-label', favoriteState ? 'Убрать из избранного' : 'Добавить в избранное');
  favoriteButton.setAttribute('aria-pressed', String(favoriteState));
  favoriteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    favorites = favorites.includes(key) ? favorites.filter((item) => item !== key) : [...favorites, key];
    storageWrite('burger-favorites', favorites);
    const isFavorite = favorites.includes(key);
    favoriteButton.classList.toggle('is-favorite', isFavorite);
    favoriteButton.setAttribute('aria-label', isFavorite ? 'Убрать из избранного' : 'Добавить в избранное');
    favoriteButton.setAttribute('aria-pressed', String(isFavorite));
    document.querySelector('.filter-controls select')?.dispatchEvent(new Event('change', { bubbles: true }));
  });
  actions.querySelector('.recipe-open').addEventListener('click', (event) => {
    event.stopPropagation();
    openRecipeModal(card);
    showRecipeDetails(card);
  });
});

if (cards.length) {
  const grid = cards[0].closest('.recipe-grid');
  const controls = document.createElement('div');
  controls.className = 'filter-controls';
  controls.setAttribute('aria-label', 'Фильтры рецептов');
  controls.innerHTML = `
    <label class="visually-hidden" for="recipeFilterMeat">Тип мяса</label><select id="recipeFilterMeat"><option value="">Любое мясо</option><option>Говядина</option><option>Курица</option></select>
    <label class="visually-hidden" for="recipeFilterSpice">Острота</label><select id="recipeFilterSpice"><option value="">Любая острота</option><option>Не острый</option></select>
    <label class="visually-hidden" for="recipeFilterTime">Время</label><select id="recipeFilterTime"><option value="">Любое время</option><option value="25">До 25 минут</option><option value="30">До 30 минут</option></select>
    <label class="visually-hidden" for="recipeFilterDifficulty">Сложность</label><select id="recipeFilterDifficulty"><option value="">Любая сложность</option><option>Легко</option><option>Средне</option></select>
    <button type="button" class="favorites-filter" aria-pressed="false">♡ Избранное</button>`;
  grid?.parentElement.insertBefore(controls, grid);
  const favoriteFilter = controls.querySelector('.favorites-filter');
  let favoritesOnly = false;
  const filterCards = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const meat = controls.querySelector('#recipeFilterMeat').value;
    const spice = controls.querySelector('#recipeFilterSpice').value;
    const time = Number(controls.querySelector('#recipeFilterTime').value) || Infinity;
    const difficulty = controls.querySelector('#recipeFilterDifficulty').value;
    cards.forEach((card) => {
      const recipe = getRecipeData(card);
      const key = (card.querySelector('h3')?.textContent || '').trim().toLowerCase();
      const text = `${card.dataset.title || ''} ${card.dataset.text || ''} ${card.textContent}`.toLowerCase();
      const match = (!query || text.includes(query)) && (!meat || recipe.meat === meat) &&
        (!spice || recipe.spice === spice) && recipe.time <= time &&
        (!difficulty || recipe.difficulty === difficulty) && (!favoritesOnly || favorites.includes(key));
      card.classList.toggle('hidden', !match);
    });
  };
  controls.querySelectorAll('select').forEach((select) => select.addEventListener('change', filterCards));
  favoriteFilter.addEventListener('click', () => {
    favoritesOnly = !favoritesOnly;
    favoriteFilter.setAttribute('aria-pressed', String(favoritesOnly));
    favoriteFilter.textContent = favoritesOnly ? '♥ Избранное' : '♡ Избранное';
    filterCards();
  });
  searchInput?.addEventListener('input', filterCards);

  const randomButton = document.querySelector('.random-recipe');
  randomButton?.addEventListener('click', () => {
    const visibleCards = cards.filter((card) => !card.classList.contains('hidden'));
    const choice = visibleCards[Math.floor(Math.random() * visibleCards.length)];
    if (choice) {
      openRecipeModal(choice);
      showRecipeDetails(choice);
    }
  });
}

const headerSearch = document.querySelector('.search-box input');
const headerSearchButton = document.querySelector('.search-box button');
const runSearch = () => {
  if (!headerSearch) return;
  if (!cards.length) {
    window.location.href = `рецепты.html?q=${encodeURIComponent(headerSearch.value.trim())}`;
    return;
  }
  document.querySelector('.filter-controls')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  headerSearch.dispatchEvent(new Event('input', { bubbles: true }));
};
headerSearchButton?.addEventListener('click', runSearch);
headerSearch?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runSearch();
});
const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery && searchInput) {
  searchInput.value = initialQuery;
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
}

const motionOff = storageRead('burger-motion-off', false) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOff) document.body.classList.add('motion-off');
const motionButton = document.createElement('button');
motionButton.type = 'button';
motionButton.className = 'motion-toggle';
motionButton.textContent = document.body.classList.contains('motion-off') ? 'Анимация выкл.' : 'Анимация вкл.';
motionButton.setAttribute('aria-pressed', String(!document.body.classList.contains('motion-off')));
motionButton.addEventListener('click', () => {
  document.body.classList.toggle('motion-off');
  const enabled = !document.body.classList.contains('motion-off');
  motionButton.textContent = enabled ? 'Анимация вкл.' : 'Анимация выкл.';
  motionButton.setAttribute('aria-pressed', String(enabled));
  storageWrite('burger-motion-off', !enabled);
});
(document.querySelector('.hero-actions') || document.body).append(motionButton);

const timeButton = document.createElement('button');
timeButton.type = 'button';
timeButton.className = 'time-toggle';
timeButton.textContent = 'Остановить время';
timeButton.setAttribute('aria-pressed', 'false');
timeButton.addEventListener('click', () => {
  const stopped = document.body.classList.toggle('time-stopped');
  timeButton.textContent = stopped ? 'Возобновить время' : 'Остановить время';
  timeButton.setAttribute('aria-pressed', String(stopped));
});
(document.querySelector('.hero-actions') || document.body).append(timeButton);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealTargets = document.querySelectorAll('.recipe-card, .ingredient-card, .info-card, .video-card, .section-heading, .crew-heading, .hero-character');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}
