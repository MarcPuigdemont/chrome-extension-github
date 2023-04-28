// Delay the whole execution to try make sure navigation has finished
setTimeout(() => {
  // Make sure the script is running on a proper environment
  if (document.documentElement.innerHTML !== '<head></head><body></body>') {
    // service worker will run this when navigating from a pr to another page, so make sure we actually need to run it
    const regex = /^https:\/\/github\.com\/PartnerPage\/(Apps|Backend)\/pull\/[0-9]+$/;
    if (regex.test(document.URL)) {
      // since service worker will inject this script many times as the navigation event is triggered multiple times,
      // lockMarcPRScript is used to prevent this from running multiple times
      if (window.lockMarcPRScript !== true) {
        window.lockMarcPRScript = true;

        const highlightTimeline = () => setTimeout(()=> {
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

          const mergeRemoteBranchBackportText = `Merge remote-tracking branch 'origin/staging' into staging-to-dev`;
          const mergeRemoteBranchDeployText = `Merge remote-tracking branch 'origin/staging' into staging-to-prod`;
          const mergeBackportPRRegex = /Merge pull request #[0-9]+ from PartnerPage\/staging-to-dev/i;
          const mergeDeployToStagingPRRegex = /Merge pull request #[0-9]+ from PartnerPage\/dev-to-staging/i;
          const mergeRemoteDevBranchDeployText = `Merge remote-tracking branch 'origin/dev' into dev-to-staging`;

          document.querySelectorAll('.js-timeline-item.js-timeline-progressive-focus-container').forEach(function (element) {
            const elements = element.querySelectorAll('.TimelineItem.TimelineItem--condensed');
            let i = 0;
            while (i < elements.length) {
              const parent = elements[i].parentElement;
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
                if (commitDiv && commitDiv.textContent.toLowerCase().startsWith('test')) {
                  commitDiv.style.setProperty('color', 'LightGray', 'important');
                }
                // } else if (commitDiv) {
                //   commitDiv.style.fontWeight = 600;
                //   commitDiv.style.setProperty('color', 'black', 'important');
                // }

                // TODO change ticket number color to blue so it's more highlighted
              }
            
              i = i + 1;
            }
          })
        }, 1000);

        /// Help with Merge or Squash buttons
        const mergeHelper = () => {
          function isPartnerpageEngineeringUser() {
            const user = document.querySelector('.timeline-comment-header h3 a.author[data-hovercard-type="user"]').textContent;
            return user === 'partnerpage-engineering';
          }

          const interval = setInterval(function() {
            console.info('Github Helper Script: Running interval to check for merge button');
            const mergeMessage = document.querySelector('.merge-message');
            const restoreBranchButton = document.querySelector('button.pull-request-ref-restore-text');
            if (restoreBranchButton) clearInterval(interval);
            if (mergeMessage) {
              clearInterval(interval);
              document.querySelectorAll('.merge-message .BtnGroup.position-relative > button').forEach((button) => {
                if (isPartnerpageEngineeringUser()) {
                  if (button.textContent.includes('Squash and merge')) {
                    button.style.backgroundColor = 'red'
                  }
                } else {
                  if (button.textContent.includes('Merge pull request')) {
                    button.style.backgroundColor = 'red'
                  }
                }
              });
            
              if (document.getElementById('merge-helper-message')) return;
              const message = document.createElement('p');
              message.id = 'merge-helper-message';
              message.style.marginTop = '10px';
              message.style.fontWeight = 'bold';
              message.textContent =
                isPartnerpageEngineeringUser()
                ? 'This PR is a deployment PR and needs to be merged with "Merge pull request" button'
                : 'This PR is a regular PR and needs to be merged with "Squash and merge" button';
              if (mergeMessage) {
                mergeMessage.appendChild(message);
              }
            }
          }, 1000);
        }

        highlightTimeline();
        mergeHelper();
        setTimeout(() => {
          window.lockMarcPRScript = false;
        }, 1000);
      }
    }
  }
}, 1000);