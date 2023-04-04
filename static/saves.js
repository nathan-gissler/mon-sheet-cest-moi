const userId = localStorage.getItem('userId');
console.log(userId);
localStorage.setItem('userId', userId);


fetch(`/users?userId=${userId}`)
  .then(response => response.json())
  .then(user => {
    const username = user.username;
  fetch(`/scores?userId=${userId}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const scores = data.data;
    scores.forEach(score => {
      const card = document.createElement('article');
      card.className = 'card2';
      
      const scoreId = score.id
      const link = document.createElement('a');
      link.href = `score.html`;
      link.addEventListener('click', () => {
        localStorage.setItem('scoreId', scoreId);
      });
    
      const header = document.createElement('div');
      const subheading = document.createElement('p');
      subheading.className = 'sub-heading';
      subheading.textContent = `Par ${username} le ${new Date(score.updatedAt).toLocaleDateString()}`;
      
      const title = document.createElement('h2');
      title.textContent = score.name;
    
      const description = document.createElement('p');
      description.textContent = `score partagée avec : ${score.sharedwithId}`;
    
      const tags = document.createElement('div');
      tags.className = 'tags';
    
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = 'Mon sheet c\'est moi';
    
      tags.appendChild(tag);
      header.appendChild(subheading);
      header.appendChild(title);
      header.appendChild(description);
      link.appendChild(header);
      link.appendChild(tags);
      card.appendChild(link);
      document.body.appendChild(card);
  })
})
  .catch(error => console.error(error));
})
  
// const partitions = Score.findAll({
//     where: { userId: userId },
//     attributes: ['name', 'updatedAt', 'sharedwithId'],
//     include: [{ model: User, attributes: ['username'] }]
//   });

//   partitions.forEach(partition => {
//     const card = document.createElement('article');
//     card.className = 'card2';
  
//     const link = document.createElement('a');
//     link.href = 'saves.html';
  
//     const header = document.createElement('div');
//     const subheading = document.createElement('p');
//     subheading.className = 'sub-heading';
//     subheading.textContent = `Par ${partition.User.username} le ${partition.updatedAt.toLocaleDateString()}`;
  
//     const title = document.createElement('h2');
//     title.textContent = partition.name;
  
//     const description = document.createElement('p');
//     description.textContent = `Partition partagée avec : ${partition.sharedwithId}`;
  
//     const tags = document.createElement('div');
//     tags.className = 'tags';
  
//     const tag = document.createElement('span');
//     tag.className = 'tag';
//     tag.textContent = 'Mon sheet c\'est moi';
  
//     tags.appendChild(tag);
//     header.appendChild(subheading);
//     header.appendChild(title);
//     header.appendChild(description);
//     link.appendChild(header);
//     link.appendChild(tags);
//     card.appendChild(link);
//     document.body.appendChild(card);
//   });
