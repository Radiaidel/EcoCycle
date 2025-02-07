import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateRequestStatus } from '../../../core/state/collect-request/collect-request.actions';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollectProcessService } from '../../../core/services/collect-process.service';
import { MaterialType } from '../../../core/models/MaterialType.model';
import { CollectRequest } from '../../../core/models/collect-request';
import { CollectProcess } from '../../../core/models/collect-process.model';
import { validateCollectRequest } from '../../../core/state/collect-process/collection-process.actions';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    selector: 'app-collect-process',
    templateUrl: './collect-process.component.html',
})
export class CollectProcessComponent {
    currentStep = 1;
    collectForm: FormGroup = new FormGroup({});
    selectedFiles: File[] = [];
    currentRequest?: CollectRequest | undefined;

    steps = [
        { number: 1, label: 'Matériaux', icon: 'fas fa-recycle' },
        { number: 2, label: 'Poids', icon: 'fas fa-weight' },
        { number: 3, label: 'Photos', icon: 'fas fa-camera' },
        { number: 4, label: 'Validation', icon: 'fas fa-check-circle' }
    ];

    availableMaterials: MaterialType[] = [
        { id: 'plastic', name: 'Plastique', icon: 'fas fa-wine-bottle' },
        { id: 'paper', name: 'Papier', icon: 'fas fa-newspaper' },
        { id: 'metal', name: 'Métal', icon: 'fas fa-cube' },
        { id: 'glass', name: 'Verre', icon: 'fas fa-glass-martini' },
        { id: 'electronics', name: 'Électronique', icon: 'fas fa-laptop' },
        { id: 'organic', name: 'Organique', icon: 'fas fa-leaf' }
    ];


    constructor(
        private fb: FormBuilder,
        private collectService: CollectProcessService,
        private router: Router,
        private store: Store,
        private notificationService: NotificationService,
        private route: ActivatedRoute
    ) {
        this.initForm();
        this.loadCurrentRequest();

    }

    private loadCurrentRequest() {
        const requestId = this.route.snapshot.paramMap.get('id');
        
        if (requestId) {
            const collectRequests: CollectRequest[] = JSON.parse(localStorage.getItem('collectRequests') || '[]');

            this.currentRequest = collectRequests.find(req => req.id === requestId);

            if (!this.currentRequest) {
                this.notificationService.showMessage('Requête non trouvée pour cet ID.', 'error');
                this.router.navigate(['/']);  
            }
        } else {
            this.notificationService.showMessage('ID de la requête non valide.', 'error');
            this.router.navigate(['/']);  
        }
    }


    private initForm() {
        this.collectForm = this.fb.group({
            materials: this.fb.array([])
        });
    }

    get materialsArray() {
        return this.collectForm.get('materials') as FormArray;
    }

    get selectedMaterials() {
        return this.materialsArray.controls.map(control => {
            const material = this.availableMaterials.find(m => m.id === control.get('id')?.value);
            return {
                ...material,
                weight: control.get('weight')?.value
            };
        });
    }

    toggleMaterial(material: MaterialType) {
        const index = this.findMaterialIndex(material.id);
        if (index === -1) {
            this.materialsArray.push(
                this.fb.group({
                    id: [material.id],
                    weight: ['', [Validators.required, Validators.min(0)]]
                })
            );
        } else {
            this.materialsArray.removeAt(index);
        }
    }

    findMaterialIndex(id: string): number {
        return this.materialsArray.controls.findIndex(
            control => control.get('id')?.value === id
        );
    }

    isMaterialSelected(id: string): boolean {
        return this.findMaterialIndex(id) !== -1;
    }

    getMaterialWeight(id: string): number {
        const index = this.findMaterialIndex(id);
        if (index !== -1) {
            return this.materialsArray.at(index).get('weight')?.value || 0;
        }
        return 0;
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files) {
            this.selectedFiles = [...this.selectedFiles, ...Array.from(files) as File[]];
        }
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    getFilePreview(file: File): string {
        return URL.createObjectURL(file);
    }

    canProceedToNextStep(): boolean {
        switch (this.currentStep) {
            case 1:
                return this.materialsArray.length > 0;
            case 2:
                return this.materialsArray.controls.every(control =>
                    control.get('weight')?.valid
                );
            default:
                return true;
        }
    }

    nextStep() {
        if (this.currentStep < 4 && this.canProceedToNextStep()) {
            this.currentStep++;
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    async cancelProcess() {
        const confirmed = window.confirm(
            'Êtes-vous sûr de vouloir annuler le processus ?'
        );
    
        if (confirmed) {
            try {
                if (this.currentRequest) {
                    await this.collectService.updateRequestStatus(this.currentRequest.id, 'rejected');
                }
                this.router.navigate(['/']);
            } catch (error) {
                console.error('Error while updating status:', error);
            }
        }
    }
    
    async onSubmit() {
        if (this.collectForm.valid) {
            try {
                if (!this.currentRequest) {
                    this.notificationService.showMessage('Erreur : la requête actuelle n\'est pas définie.', 'error');
                    return;
                }
    
                const processDetails: CollectProcess = {
                    requestId: this.currentRequest.id,
                    wasteDetails: this.selectedMaterials
                        .filter(material => material.id !== undefined)
                        .map(material => ({
                            type: material.id as string,
                            realWeight: material.weight
                        })),
                    totalRealWeight: this.calculateTotalWeight(),
                    processPhotos: this.selectedFiles.map(file => URL.createObjectURL(file)),
                    validationDate: new Date().toISOString(),
                    collectorNotes: this.collectForm.get('notes')?.value
                };
    
                this.store.dispatch(updateRequestStatus({
                    requestId: this.currentRequest.id,
                    status: 'validated'
                }));
    
                this.store.dispatch(validateCollectRequest({
                    requestId: this.currentRequest.id,
                    processDetails
                }));
    
                this.router.navigate(['/']);
    
            } catch (error) {
                console.error('Erreur lors de la validation:', error);
                this.notificationService.showMessage('Une erreur est survenue lors de la validation.', 'error');
            }
        }
    }
    
    private calculateTotalWeight(): number {
        return this.selectedMaterials.reduce((total, material) =>
            total + (Number(material.weight) || 0), 0);
    }
    

}    