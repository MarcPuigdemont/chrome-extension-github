const mergeRemoteBranchBackportText = `Merge remote-tracking branch 'origin/staging' into staging-to-dev`;
const mergeRemoteBranchDeployText = `Merge remote-tracking branch 'origin/staging' into staging-to-prod`;
const mergeBackportPRRegex = /Merge pull request #[0-9]+ from PartnerPage\/staging-to-dev/i;
const mergeDeployToStagingPRRegex = /Merge pull request #[0-9]+ from PartnerPage\/dev-to-staging/i;
const mergeRemoteDevBranchDeployText = `Merge remote-tracking branch 'origin/dev' into dev-to-staging`;

function createHeaderDiv(color, text) {
  const div = document.createElement("div");
  div.classList.add("TimelineItem");
  div.classList.add("TimelineItem--condensed");
  div.innerHTML = `<div style="width: 20px; height: 2px; background-color: ${color}; align-self: center; margin-right: 5px;"></div>${text}`;
  div.style.fontWeight = 500;

  return div;
}

function createTimelineDiv(color, height) {
  const div = document.createElement("div");
  div.style.position = 'absolute';
  div.style.width = '2px';
  div.style.height = '36px';
  if (height) {
    div.style.height = height;
  }
  div.style.backgroundColor = color;

  return div;
}

document.querySelectorAll('[data-test-selector="pr-timeline-commits-list"]').forEach(function (parent) {
  const elements = parent.querySelectorAll('.TimelineItem');
  let i = 0;
  while (i < elements.length) {
    const hasBackportCommit1 = elements[i].textContent.includes(mergeRemoteBranchBackportText);
    const hasBackportCommit2 = elements[i+1] ? mergeBackportPRRegex.test(elements[i+1].textContent) : false;
    const hasMergeRemoteDevBranchCommit = elements[i].textContent.includes(mergeRemoteDevBranchDeployText);
    if (hasBackportCommit1) {
      if (hasBackportCommit2) {
        const backportCommitDiv1 = elements[i];
        const backportCommitDiv2 = elements[i + 1];
        backportCommitDiv1.style.paddingLeft = "35px";
        backportCommitDiv2.style.paddingLeft = "35px";
    
        const backportDiv = createHeaderDiv('#1D76DB', 'Backport');
        parent.insertBefore(backportDiv, backportCommitDiv1);
    
        backportDiv.insertBefore(createTimelineDiv('#1D76DB'), backportDiv.firstChild);
        backportCommitDiv1.insertBefore(createTimelineDiv('#1D76DB'), backportCommitDiv1.firstChild);
        backportCommitDiv2.insertBefore(createTimelineDiv('#1D76DB', '10px'), backportCommitDiv2.firstChild);
    
        // Move one extra as backport is composed by two commits
        i = i + 1;
      } else {
        const backportCommitDiv = elements[i];
        backportCommitDiv.style.paddingLeft = "35px";
    
        const backportDiv = createHeaderDiv('#1D76DB', 'Current backport');
        parent.insertBefore(backportDiv, backportCommitDiv);
    
        backportDiv.insertBefore(createTimelineDiv('#1D76DB'), backportDiv.firstChild);
      }
    } else if (mergeDeployToStagingPRRegex.test(elements[i].textContent)) {
      const deployToStagingCommitDiv = elements[i];
      deployToStagingCommitDiv.style.paddingLeft = "35px";
  
      const deployDiv = createHeaderDiv('#0E8A16', 'Deploy to staging'); // TODO Get and add depoy name. Should get from 'staging-to-dev-pikachu'
      parent.insertBefore(deployDiv, deployToStagingCommitDiv);
  
      deployDiv.insertBefore(createTimelineDiv('#0E8A16'), deployDiv.firstChild);
      deployToStagingCommitDiv.insertBefore(createTimelineDiv('#0E8A16', '10px'), deployToStagingCommitDiv.firstChild);
    } else if (elements[i].textContent.includes(mergeRemoteBranchDeployText)) {
      const deployToProdCommitDiv = elements[i];
      deployToProdCommitDiv.style.paddingLeft = "35px";
  
      const deployDiv = createHeaderDiv('#0E8A16', 'Current Deploy to prod'); // TODO Get and add depoy name. Should get from 'staging-to-dev-pikachu'
      parent.insertBefore(deployDiv, deployToProdCommitDiv);
  
      deployDiv.insertBefore(createTimelineDiv('#0E8A16'), deployDiv.firstChild);
      deployToProdCommitDiv.insertBefore(createTimelineDiv('#0E8A16'), deployToProdCommitDiv.firstChild);
    } else if (hasMergeRemoteDevBranchCommit) {
      if (elements[i+1] && mergeDeployToStagingPRRegex.test(elements[i+1].textContent)) {
        const deployCommitDiv1 = elements[i];
        const deployCommitDiv2 = elements[i + 1];
        deployCommitDiv1.style.paddingLeft = "35px";
        deployCommitDiv2.style.paddingLeft = "35px";
    
        const deployDiv = createHeaderDiv('#0E8A16', 'Deploy to staging without backport'); // TODO Get and add depoy name. Should get from 'staging-to-dev-pikachu'
        parent.insertBefore(deployDiv, deployCommitDiv1);
    
        deployDiv.insertBefore(createTimelineDiv('#0E8A16'), deployDiv.firstChild);
        deployCommitDiv1.insertBefore(createTimelineDiv('#0E8A16'), deployCommitDiv1.firstChild);
        deployCommitDiv2.insertBefore(createTimelineDiv('#0E8A16', '10px'), deployCommitDiv2.firstChild);

        // Move one extra as backport is composed by two commits
        i = i + 1;
      } else {
        const deployToStagingCommitDiv = elements[i];
        deployToStagingCommitDiv.style.paddingLeft = "35px";
    
        const deployDiv = createHeaderDiv('#0E8A16', 'This deploy has no backport'); // TODO Get and add depoy name. Should get from 'staging-to-dev-pikachu'
        parent.insertBefore(deployDiv, deployToStagingCommitDiv);
    
        deployDiv.insertBefore(createTimelineDiv('#0E8A16'), deployDiv.firstChild);
        deployToStagingCommitDiv.insertBefore(createTimelineDiv('#0E8A16', '10px'), deployToStagingCommitDiv.firstChild);
      }
    } else {
      // regular commit
      const commitDiv = elements[i].querySelector('a[title]');
      if (commitDiv.textContent.toLowerCase().startsWith('test')) {
        commitDiv.style.setProperty('color', 'LightGray', 'important');
      } else {
        commitDiv.style.fontWeight = 600;
        commitDiv.style.setProperty('color', 'black', 'important');
      }

      // TODO change ticket number color to blue so it's more highlighted
    }
  
    i = i + 1;
  }
})

