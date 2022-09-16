const mergeRemoteBranchText = "Merge remote-tracking branch 'origin/staging' into staging-to-dev"
const mergePRRegex = /Merge pull request #[0-9]+ from PartnerPage\/staging-to-dev/i;
const parent = document.querySelector('[data-test-selector="pr-timeline-commits-list"]');
const elements = parent.querySelectorAll('.TimelineItem');

let i = 0;
while (i < elements.length) {
  const hasBackportCommit1 = elements[i].textContent.includes(mergeRemoteBranchText);
  const hasBackportCommit2 = mergePRRegex.test(elements[i+1].textContent);
  if (hasBackportCommit1 && hasBackportCommit2) {
    const backportCommitDiv1 = elements[i];
    const backportCommitDiv2 = elements[i + 1];
    backportCommitDiv1.style.paddingLeft = "35px";
    backportCommitDiv2.style.paddingLeft = "35px";

    const backportDiv = document.createElement("div");
    backportDiv.classList.add("TimelineItem");
    backportDiv.classList.add("TimelineItem--condensed");
    backportDiv.classList.add("TimelineItem--backport");
    backportDiv.innerHTML = '<div style="width: 20px; height: 2px; background-color: #1D76DB; align-self: center; margin-right: 5px;"></div>Backport';
    backportDiv.style.fontWeight = 500;
    parent.insertBefore(backportDiv, backportCommitDiv1);

    const timelineDiv = document.createElement("div");
    timelineDiv.style.position = 'absolute';
    timelineDiv.style.width = '2px';
    timelineDiv.style.height = '36px';
    timelineDiv.style.backgroundColor = '#1D76DB';

    backportDiv.insertBefore(timelineDiv, backportDiv.firstChild);
    backportCommitDiv1.insertBefore(timelineDiv.cloneNode(), backportCommitDiv1.firstChild);
    const timelineDiv2 = timelineDiv.cloneNode();
    timelineDiv2.style.height = '10px';
    backportCommitDiv2.insertBefore(timelineDiv2, backportCommitDiv2.firstChild);

    i = i + 2;
  } else {
    i = i + 1;
  }
}