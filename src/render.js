export default (elements, i18nInstance, state) => (path, value, prevValue) => {
  const renderForm = () => {
    switch (value) {
      case 'failed':
        elements.submitButton.removeAttribute('disabled');
        elements.input.classList.add('is-invalid');
        break;
      case 'processing': {
        elements.submitButton.setAttribute('disabled', 'true');
        break;
      }
      case 'processed': {
        elements.submitButton.removeAttribute('disabled');
        elements.input.classList.remove('is-invalid');
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');
        elements.feedback.textContent = i18nInstance.t('form.success');
        elements.form.reset();
        elements.input.focus();
        break;
      }
      default:
        throw new Error(`state by value:'${value}' is not found`);
    }
  };
  const renderFeeds = () => {
    const isFirstFeedRender = value.length === 1;
    if (isFirstFeedRender) {
      const divCard = document.createElement('div');
      const divCardBody = document.createElement('div');
      const divCardTitle = document.createElement('h2');
      const ul = document.createElement('ul');
      divCard.classList.add('card', 'border-0');
      elements.feeds.append(divCard);
      divCardBody.classList.add('card-body');
      divCard.append(divCardBody);
      divCardTitle.classList.add('card-title', 'h4');
      divCardTitle.textContent = i18nInstance.t('main.feeds.name');
      divCardBody.append(divCardTitle);
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      divCard.append(ul);
    }
    const lastFeed = value[value.length - 1];
    const { title, description } = lastFeed;
    const ul = elements.feeds.querySelector('ul');
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.prepend(li);
    const header = document.createElement('h3');
    header.classList.add('h6', 'm-0');
    header.textContent = title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = description;
    li.append(header, p);
  };
  const renderPosts = () => {
    const isFirstPostRender = prevValue.length === 0;
    if (isFirstPostRender) {
      const divCard = document.createElement('div');
      const divCardBody = document.createElement('div');
      const divCardTitle = document.createElement('h2');
      divCard.classList.add('card', 'border-0');
      elements.posts.append(divCard);
      divCardBody.classList.add('card-body');
      divCardTitle.classList.add('card-title', 'h4');
      divCardTitle.textContent = i18nInstance.t('main.posts.name');
      divCardBody.append(divCardTitle);
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      divCard.append(divCardBody, ul);
    }
    const newPosts = value.filter((currentValue) => !prevValue.includes(currentValue));
    newPosts.forEach((item) => {
      const { title, postLink, id } = item;
      const ul = document.querySelector('.posts ul');
      const li = document.createElement('li');
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      );
      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.setAttribute('href', postLink);
      a.setAttribute('data-id', id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'nooperer');
      a.setAttribute('rel', 'noreferrer');
      a.textContent = title;
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'buttom-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = i18nInstance.t('main.posts.button.name');
      li.append(a, button);
      ul.prepend(li);
    });
  };
  const renderModal = () => {
    const post = state.posts.find(({ id }) => id === value);
    const { title, description, postLink } = post;
    const modalTitle = document.querySelector('.modal-title');
    modalTitle.textContent = title;
    const modalBody = document.querySelector('.modal-body');
    modalBody.textContent = description;
    const buttonToFullArticle = document.querySelector('.full-article');
    buttonToFullArticle.setAttribute('href', postLink);
  };
  const renderViewedPosts = () => {
    value.forEach((id) => {
      const actualPost = document.querySelector(`.posts li [data-id="${id}"]`);
      actualPost.classList.remove('fw-bold');
      actualPost.classList.add('fw-normal');
    });
  };
  const renderError = () => {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = i18nInstance.t(value);
  };

  switch (path) {
    case 'form.state': {
      renderForm();
      break;
    }
    case 'feeds': {
      renderFeeds();
      break;
    }
    case 'posts': {
      renderPosts();
      break;
    }
    case 'uiState.modal': {
      renderModal();
      break;
    }
    case 'uiState.viewedPosts': {
      renderViewedPosts();
      break;
    }
    case 'form.error': {
      renderError();
      break;
    }
    default:
      throw new Error(`state by path:'${path}' is not found`);
  }
};
