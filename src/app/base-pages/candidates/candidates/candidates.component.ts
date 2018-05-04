import {Component, OnInit, ViewChild, ElementRef, TemplateRef} from '@angular/core';

import {BsModalService} from "ngx-bootstrap/modal";
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {CandidateService} from '../../service/candidate/candidate.service';
import {Candidate} from './candidate';
import {NewCandidate} from '../../service/candidate/newCandidate'
import {FilterCandidates} from "../../service/candidate/filterCandidates";
import {Pagination} from "../../common/components/footer/pagination";


@Component({
  moduleId: module.id,
  selector: 'app-candidates',
  templateUrl: 'candidates.component.html',
  styleUrls: ['candidates.component.css'],
  providers: [CandidateService]
})
export class CandidatesComponent implements OnInit {

  candidates: Candidate[] = [];
  statuses: string[] = [];
  vacancies: string[] = [];
  total: number = 1;
  range: string;
  filterPosition: string = 'All positions';
  filterStatus: string = 'All statuses';
  positionValid: boolean = false;

  filter: FilterCandidates = {
    name: '',
    position: '',
    date: '',
    status: '',
    email: ''
  };

  pagination: Pagination = {
    rows: 10,
    begin: 0,
    page: 1
  };

  newCandidate: NewCandidate = {
    name: '',
    email: '',
    position: '',
    status: 'New'
  };

  @ViewChild("candidatesColumns")
  numberColumns: ElementRef;

  modalRef: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  };

  constructor(private modalService: BsModalService,
              private candidateService: CandidateService) {
  }

  ngOnInit() {
    this.getCandidates();
    this.numberColumns = this.numberColumns.nativeElement.childElementCount;
  }

  getCandidates() {
    this.candidateService.getCandidates(this.filter, this.pagination).subscribe((data: any) => {
      this.candidates = data.candidates;
      this.statuses = data.statuses;
      this.vacancies = data.vacancies;
      this.total = data.total;
      this.range = data.range;
    });
  }

  paginationStart(){
    this.pagination.page = 1;
    this.pagination.begin = 0;
  }

  filtering(id, filterValue) {
    this.filter[id] = filterValue;
    this.paginationStart();
    this.getCandidates();
  }

  setFilterPosition(filterPosition) {
    filterPosition = filterPosition.target.innerText;

    this.filterPosition = filterPosition;
    this.paginationStart();

    if (filterPosition !== 'All positions') {
      this.filter.position = filterPosition;
      this.getCandidates();
    }
    else {
      this.filter.position = '';
      this.getCandidates();
    }
  }

  setFilterStatus(filterStatus) {
    filterStatus = filterStatus.target.innerText;

    this.filterStatus = filterStatus;
    this.paginationStart();

    if (filterStatus !== 'All statuses') {
      this.filter.status = filterStatus;
      this.getCandidates();
    }
    else {
      this.filter.status = '';
      this.getCandidates();
    }
  }

  changeRowsNumber(numberRows) {
    this.pagination.rows = +numberRows;
    this.paginationStart();
    this.getCandidates();
  }

  goToPage(classDirection) {
    if (classDirection == "button-next" && this.hasNext()) {
      this.pagination.begin += this.pagination.rows;
      this.pagination.page += 1;
      this.getCandidates();
    }

    if (classDirection == "button-prev" && this.hasPrevious()) {
      this.pagination.begin -= this.pagination.rows;
      this.pagination.page -= 1;
      this.getCandidates();
    }
  }

  hasNext() {
    return this.total - this.pagination.rows - this.pagination.begin > 0;
  }

  hasPrevious() {
    return this.pagination.begin - this.pagination.rows >= 0;
  }

  notFound() {
    return !this.total;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  setPositionNewCandidate(event){
    this.newCandidate.position = event.target.innerText;
    if(event !== ''){
      this.positionValid = true;
    }
  }

  clearNewCandidates(){
    this.modalRef.hide();
    this.newCandidate.position = '';
    this.newCandidate.email = '';
    this.newCandidate.name = '';
    this.positionValid = false;
  }

  addCandidate(newCandidate){
    this.candidateService.addCandidate(newCandidate).subscribe(
      error => console.log(error));
    this.clearNewCandidates();
    this.getCandidates();
  }

}
